import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';

import { OptionsService } from './options.service';

@Injectable() 
export class NotificationService {

  constructor(private optionsService: OptionsService) { }

  message(title: string, message: string): Observable<string> {
    return this.optionsService.get().flatMap(options => {
      let notification: browser.notifications.NotificationOptions = {
        type: "basic",
        iconUrl: browser.extension.getURL("images/icon-128.png"),
        title: title,
        message: message
      };
      return Observable.fromPromise(browser.notifications.create(undefined, notification));
    });
  }

  error(message: string): Observable<string> {
    return this.optionsService.get().flatMap(options => {
      let notification: browser.notifications.NotificationOptions = {
        type: "basic",
        iconUrl: browser.extension.getURL("images/error-128.png"),
        title: 'Error',
        message: message
      };
      return Observable.fromPromise(browser.notifications.create(undefined, notification));
    });
  }
  
}
