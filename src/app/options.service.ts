import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';

import { Options } from './options'

@Injectable()
export class OptionsService {

  get(): Observable<Options> {
    return Observable.fromPromise(browser.storage.local.get({
      authToken: '',
      saveBookmarksInNewWindow: true,
      showDesktopNotifications: true,
      privacyOverride: 'DEFAULT',
      menuItems: [
        { key: 'ALL', enabled: true },
        { key: 'PRIVATE', enabled: true },
        { key: 'UNREAD', enabled: true },
        { key: 'STARRED', enabled: true },
        { key: 'NETWORK', enabled: true },
        { key: 'RECENT', enabled: true },
        { key: 'POPULAR', enabled: true },
        { key: 'NOTES', enabled: true },
        { key: 'SAVE_BOOKMARK', enabled: true },
        { key: 'READ_LATER', enabled: true },
        { key: 'OPTIONS', enabled: true }
      ]
    }));
  }

  set(options: Options): Observable<void> {
    let values = {
      authToken: options.authToken,
      saveBookmarksInNewWindow: options.saveBookmarksInNewWindow,
      showDesktopNotifications: options.showDesktopNotifications,
      privacyOverride: options.privacyOverride,
      menuItems: options.menuItems
    };
    return Observable.fromPromise(browser.storage.local.set(values));
  }
}
