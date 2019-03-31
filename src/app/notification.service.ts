import { Injectable } from '@angular/core';
import { from as observableFrom,  Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { OptionsService } from './options.service';

@Injectable() 
export class NotificationService {

  constructor(private optionsService: OptionsService) { }

  message(title: string, message: string): Observable<string> {
    return this.optionsService.get().pipe(mergeMap(options => {
      let notification: browser.notifications.NotificationOptions = {
        type: "basic",
        iconUrl: browser.extension.getURL("images/icon-128.png"),
        title: title,
        message: message
      };
      return observableFrom(browser.notifications.create(undefined, notification));
    }));
  }

  error(message: string): Observable<string> {
    return this.optionsService.get().pipe(mergeMap(options => {
      let notification: browser.notifications.NotificationOptions = {
        type: "basic",
        iconUrl: browser.extension.getURL("images/error-128.png"),
        title: chrome.i18n.getMessage('NT_ERROR'),
        message: message
      };
      return observableFrom(browser.notifications.create(undefined, notification));
    }));
  }
  
}
