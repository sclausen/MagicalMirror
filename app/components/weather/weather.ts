import 'moment';
import {Component, Input, OnInit} from 'angular2/core';
import {Headers, Http, Jsonp, RequestOptions, URLSearchParams} from 'angular2/http';
import {MomentPipe, RoundValuePipe}  from '../../pipes';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'weather',
  templateUrl: 'app/components/weather/weather.html',
  pipes: [RoundValuePipe, MomentPipe]
})
export class Weather implements OnInit {
  @Input() config;

  private params: {
    cnt: number;
    q: string;
    units: string;
    lang: string;
    APPID: string;
  };
  private iconTable = {
    '01d': 'wi-day-sunny',
    '02d': 'wi-day-cloudy',
    '03d': 'wi-cloudy',
    '04d': 'wi-cloudy-windy',
    '09d': 'wi-showers',
    '10d': 'wi-rain',
    '11d': 'wi-thunderstorm',
    '13d': 'wi-snow',
    '50d': 'wi-fog',
    '01n': 'wi-night-clear',
    '02n': 'wi-night-cloudy',
    '03n': 'wi-night-cloudy',
    '04n': 'wi-night-cloudy',
    '09n': 'wi-night-showers',
    '10n': 'wi-night-rain',
    '11n': 'wi-night-thunderstorm',
    '13n': 'wi-night-snow',
    '50n': 'wi-night-alt-cloudy-windy'
  };
  private weatherIcon;
  private temperature;
  private bft;
  private sunIcon;
  private sunriseOrSunset;
  private forecasts: any[];
  private timeFormat = 'HH:mm';

  private apiVersion = '2.5';
  private apiBase = 'http://api.openweathermap.org/data';
  private weatherEndpoint = 'weather';
  private forecastEndpoint = 'forecast/daily';
  private updateCurrentWeatherInterval = moment.duration(1, 'hour');
  private updateForecastInterval = moment.duration(1, 'day');
  private opacityDecreaseFactory: number;

  private endsWith(str: string, suffix: string): boolean {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  constructor(private jsonp: Jsonp, private http: Http) { }

  /**
   * Rounds a float to one decimal place
   * @param  {number} temperature The temperature to be rounded
   * @return {number}             The new floating point value
   */
  private roundValue(value): string {
    return parseFloat(value).toFixed(1);
  }

  /**
   * Converts the wind speed (km/h) into the values given by the Beaufort Wind Scale
   * @see http://www.spc.noaa.gov/faq/tornado/beaufort.html
   * @param  {number} kmh The wind speed in Kilometers Per Hour
   * @return {number}     The wind speed converted into its corresponding Beaufort number
   */
  private ms2Beaufort(ms: number): number {
    let kmh = ms * 60 * 60 / 1000;
    let speeds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117, 1000];
    for (let beaufort in speeds) {
      if (speeds.hasOwnProperty(beaufort)) {
        let speed = speeds[beaufort];
        if (speed > kmh) {
          return parseInt(beaufort, 10);
        }
      }
    }
    return 12;
  }

  private getWeather(url: string, options: RequestOptions): Observable<any> {
    return this.jsonp.get(url, options)
      .map(res => {
      return res.json();
    });
    // .catch(this.handleError);
  }

  /*  private getWeather(url: string, options: RequestOptions): Observable<any> {
      if (this.endsWith(url, 'weather')) {
        return this.http.get('weather.json').map(res => res.json());
      } else {
        return this.http.get('forecasts.json').map(res => res.json());
      }
    }*/

  /**
   * Retrieves the current temperature and weather patter from the OpenWeatherMap API
   */
  private updateCurrentWeather() {
    var params = new URLSearchParams();
    Object.keys(this.params).forEach(key => {
      let val = this.params[key];
      params.set(key, val);
    });
    params.set('callback', 'JSONP_CALLBACK');
    // let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ search: params });
    let url = this.apiBase + '/' + this.apiVersion + '/' + this.weatherEndpoint;

    this.getWeather(url, options)
      .subscribe(data => {
      this.temperature = this.roundValue(data.main.temp);
      this.weatherIcon = this.iconTable[data.weather[0].icon];
      this.bft = this.ms2Beaufort(data.wind.speed);
      // this.opacity = 1;

      // let _temperatureMin = this.roundValue(data.main.temp_min);
      // let _temperatureMax = this.roundValue(data.main.temp_max);

      let now = moment();
      let sunrise = moment(data.sys.sunrise * 1000);
      let sunset = moment(data.sys.sunset * 1000);

      if (sunrise.isBefore(now) && sunset.isAfter(now)) {
        this.sunriseOrSunset = sunset.format(this.timeFormat);
        this.sunIcon = 'wi-sunset';
      } else {
        this.sunIcon = 'wi-sunrise';
        this.sunriseOrSunset = sunrise.format(this.timeFormat);
      }
    });
  }


  /**
   * Updates the n Day Forecast from the OpenWeatherMap API
   */
  private updateWeatherForecast() {
    var params = new URLSearchParams();
    Object.keys(this.params).forEach(key => {
      let val = this.params[key];
      params.set(key, val);
    });
    params.set('callback', 'JSONP_CALLBACK');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, search: params });
    let url = this.apiBase + '/' + this.apiVersion + '/' + this.forecastEndpoint;
    this.getWeather(url, options)
      .subscribe(data => {
      data.list.map(forecast => { forecast.dt *= 1000; return forecast; });
      this.forecasts = data.list;
    });
  }

  public ngOnInit() {
    this.params = this.config.params;
    this.timeFormat = this.config.timeFormat || this.timeFormat;
    this.updateCurrentWeatherInterval = this.config.updateCurrentWeatherInterval || this.updateCurrentWeatherInterval;
    this.updateForecastInterval = this.config.updateForecastInterval || this.updateForecastInterval;
    this.opacityDecreaseFactory = (1 - .225) / this.params.cnt;

    setInterval(() => {
      setTimeout(() => this.updateCurrentWeather(), 0);
    }, this.updateCurrentWeatherInterval);

    setInterval(() => {
      setTimeout(() => this.updateWeatherForecast(), 1500);
    }, this.updateForecastInterval);

    setTimeout(() => this.updateCurrentWeather(), 0);
    setTimeout(() => this.updateWeatherForecast(), 1500);
  }
};
