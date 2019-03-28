import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';

import { OptionsService } from './options.service';

@Injectable() 
export class IconService {

  constructor(private optionsService: OptionsService) { }

  set(): Observable<void> {
    return this.optionsService.get().flatMap(options => 
      Observable.fromPromise(browser.browserAction.setIcon({
        path: options.theme == "DARK"  
          ? {
            "19": "images/action-dark-19.png", 
            "38": "images/action-dark-38.png"
          } : {
            "19": "images/action-19.png", 
            "38": "images/action-38.png"
          }
      }))
    );
  }
}
