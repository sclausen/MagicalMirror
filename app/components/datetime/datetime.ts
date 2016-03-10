import 'moment';
import {Component, Input, OnInit} from 'angular2/core';
import {MomentPipe} from '../../pipes';

@Component({
  selector: 'date-time',
  templateUrl: 'app/components/datetime/datetime.html',
  pipes: [MomentPipe]
})
export class DateTime implements OnInit {
  public now = moment();
  @Input() config: {timeFormat: string};
  private timeFormat = 'HH:mm';

  /**
   * Updates the time that is shown on the screen
   */
  public ngOnInit() {
    this.timeFormat = this.config.timeFormat || this.timeFormat;
    setInterval(() => {
      this.now = moment();
    }, 1000);
  }
}
