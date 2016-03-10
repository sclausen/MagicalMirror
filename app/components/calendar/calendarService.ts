import {Observable} from 'rxjs/Observable';
let gapi = window['gapi'];

export class CalendarService {
  public loadAppointments() {
    return Observable.create(observer => {
      let request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      });

      request.execute(res => observer.next(res.items));
    });
  }
}
