import 'moment';
import {Component} from 'angular2/core';
import {Calendar} from '../calendar/calendar';
import {DateTime} from '../datetime/datetime';
import {News} from '../news/news';
import {Weather} from '../weather/weather';
import {Config} from '../../config';

@Component({
  selector: 'magic-mirror',
  templateUrl: 'app/components/app/app.html',
  directives: [
    Calendar,
    DateTime,
    News,
    Weather
  ]
})
export class App {
  private config = Config;
  constructor() {
    moment.locale(this.config.locale || 'de');
  }
}
