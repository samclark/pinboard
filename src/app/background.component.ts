import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { OptionsService } from './options.service';
import { PinboardService } from './pinboard.service';
import { IconService } from './icon.service';

@Component({
  selector: 'app-background',
  template: '<h1>Pinboard Background Page</h1>'
})
export class BackgroundComponent implements OnInit {

  constructor(private iconService: IconService, 
    private optionsService: OptionsService, 
    private pinboardService: PinboardService) { }

  ngOnInit() {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.optionsService.get().subscribe(options => {
        this.pinboardService.add(options.authToken, message)
          .subscribe(() => {
            let notification: browser.notifications.NotificationOptions = {
              type: "basic",
              iconUrl: browser.extension.getURL("images/icon-128.png"),
              title: "Saved",
              message: message.url
            };
            browser.notifications.create(undefined, notification);
          }, error => {
            console.log(`error: ${error}`);
            let notification: browser.notifications.NotificationOptions = {
              type: "basic",
              iconUrl: browser.extension.getURL("images/error-128.png"),
              title: "Error",
              message: typeof error.message !== 'undefined' ? error.message : 'Unknown error'
            };
            browser.notifications.create(undefined, notification);
          })
      });
    });
    this.iconService.set().subscribe(() => {
      //updated icon
    });
  }

}
