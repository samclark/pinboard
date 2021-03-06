import { Injectable } from '@angular/core';
import { from as observableFrom, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { OptionsService } from './options.service';

@Injectable() 
export class IconService {

  constructor(private optionsService: OptionsService) { }

  set(): Observable<void> {
    return this.optionsService.get().pipe(mergeMap(options => 
      observableFrom(browser.browserAction.setIcon({
        path: options.theme == "DARK"  
          ? {
            "19": "images/action-dark-19.png", 
            "38": "images/action-dark-38.png"
          } : {
            "19": "images/action-light-19.png", 
            "38": "images/action-light-38.png"
          }
      }))
    ));
  }
}
