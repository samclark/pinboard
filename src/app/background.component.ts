import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { OptionsService } from './options.service';
import { PinboardService } from './pinboard.service';
import { IconService } from './icon.service';
import { NotificationService } from './notification.service'
import { Post } from './post'

@Component({
  selector: 'app-background',
  template: '<h1>Pinboard Background Page</h1>'
})
export class BackgroundComponent implements OnInit {

  constructor(private iconService: IconService, 
    private optionsService: OptionsService, 
    private pinboardService: PinboardService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    browser.runtime.onMessage.addListener((post: Post) => {
      this.optionsService.get().subscribe(options => 
        this.pinboardService.add(options.authToken, post).subscribe(() => {
          this.notificationService.message('Save', post.url).subscribe()
        }, error => {
          let message = typeof error.message !== 'undefined' ? error.message : 'Unknown error';
          this.notificationService.error(message).subscribe()
        }));
      });
    this.iconService.set().subscribe();
  }

}
