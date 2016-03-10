import {Injectable} from 'angular2/core';
import {Jsonp} from 'angular2/http';
import 'gapi';

let Promise = window['Promise'];

@Injectable()
export class AuthenticationService {
  private scopes = ['https://www.googleapis.com/auth/calendar.readonly'];
  private logoutUrl = 'https://accounts.google.com/o/oauth2/revoke?token=';
  public isAuthenticated: boolean = false;
  private config: {
    apiKey: string,
    clientId: string
  };

  constructor(private jsonp: Jsonp) { }

  public setConfig(config) {
    this.config = config;
  }

  public logout() {
    this.isAuthenticated = false;
    this.jsonp.get(this.logoutUrl + gapi.auth.getToken().access_token);
  }

  public login(immediate: boolean) {
    return new Promise((resolve, reject) => {
      gapi.client.setApiKey(this.config.apiKey);
      var authorisationRequestData = {
        'client_id': this.config.clientId,
        'scope': this.scopes,
        'immediate': immediate
      };
      gapi.auth.authorize(authorisationRequestData, res => {
        if (res && !res.error) {
          this.isAuthenticated = true;
          resolve();
        } else {
          this.isAuthenticated = false;
          reject();
        }
      });
    }).catch((error: any) => { console.error('error authenticating: ', error); });
  }
}
