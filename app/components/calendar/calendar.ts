import 'gapi';
import 'moment';
import {Component, Input, OnInit} from 'angular2/core';
import {CalendarService} from './calendarService';
import {AuthenticationService} from './authenticationService';


@Component({
  selector: 'calendar',
  templateUrl: 'app/components/calendar/calendar.html',
  providers: [CalendarService, AuthenticationService]
})
export class Calendar implements OnInit {
  @Input() config: {
    clientId: string;
    apiKey: string;
    refreshInterval: any;
    timeFormat: string;
  };
  public appointments: string[];
  private refreshInterval = moment.duration(1, 'day');
  private timeFormat = 'HH:mm';
  private moment;

  constructor(
    private calendarService: CalendarService,
    private authenticationService: AuthenticationService
    ) {
    this.appointments = [];
    this.moment = moment;
  }

  /*
   * loading the appointments is done asychronously. the service's loadAppointments() method
   * returns a Promise that provides access to the newly loaded set of appointments.
   */
  public refreshAppointments() {
    this.calendarService.loadAppointments().subscribe(newAppointments => {
      this.appointments = newAppointments;
    });
  }

  public ngOnInit() {
    this.refreshInterval = this.config.refreshInterval || this.refreshInterval;
    this.timeFormat = this.config.timeFormat || this.timeFormat;
    this.authenticationService.setConfig(this.config);
    this.authenticationService.login(true).then(() => {
      gapi.client.load('calendar', 'v3', () => {
        setInterval(this.refreshAppointments, this.refreshInterval);
        this.refreshAppointments();
      });
    });
  }
}
