export class Config {
  public static locale = 'de';
  public static calendar = {
    clientId: '',
    apiKey: '',
    timeFormat: 'HH:mm',
    refreshInterval: moment.duration(1, 'day')
  }
  public static datetime = {
    timeFormat: 'HH:mm'
  }
  public static news = {
    feeds: ['http://rss.golem.de/rss.php?feed=RSS2.0'],
    fetchInterval: moment.duration(1, 'hour'),
    updateInterval: moment.duration(6, 'seconds')
  }
  public static weather = {
    timeFormat: 'HH:mm',
    updateCurrentWeatherInterval: moment.duration(1, 'hour'),
    updateForecastInterval: moment.duration(1, 'day'),
    params: {
      cnt: 6,
      q: 'Hamburg,Germany',
      units: 'metric',
      lang: 'de',
      APPID: ''
    }
  }
}
