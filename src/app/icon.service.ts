import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';

import { OptionsService } from './options.service';

@Injectable() 
export class IconService {

  constructor(private optionsService: OptionsService) { }

  set(): Observable<void> {
    
    return new Observable(observer => {
      this.optionsService.get().subscribe(options => {
        if (options.theme == "DARK") {
          Observable.fromPromise(browser.browserAction.setIcon({
            path: {
              "19": "images/action-dark-19.png",
              "38": "images/action-dark-38.png"
            }
          })).subscribe(() => {
            observer.complete()
          }, error => { 
            observer.error(error)
          });
        } else {
          Observable.fromPromise(browser.browserAction.setIcon({
            path: {
              "19": "images/action-19.png",
              "38": "images/action-38.png"
            }
          })).subscribe(() => {
            observer.complete()
          }, error => { 
            observer.error(error)
          });
        }
      }, error => {
        observer.error(error);
      });
    });
  }
}
