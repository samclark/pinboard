import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { IconService } from './icon.service';
import { NotificationService } from './notification.service'
import { OptionsService } from './options.service';
import { PinboardService } from './pinboard.service';
import { Message} from './message'
import { Post } from './post'

@Component({
  selector: 'app-background',
  template: '<h1 [app-i18n]="\'BP_TITLE\'"></h1>'
})
export class BackgroundComponent implements OnInit {

  constructor(private iconService: IconService, 
    private optionsService: OptionsService, 
    private pinboardService: PinboardService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    browser.runtime.onMessage.addListener((message: Message) => {
      if (message.command == 'read-later') {
        return this.readLater();
      } else if (message.command == 'save-bookmark') {
        return this.saveBookmark();
      }
    });
    chrome.commands.onCommand.addListener((command: string) => {
      if (command == 'read-later') {
        return this.readLater();
      } else if (command == 'save-bookmark') {
        return this.saveBookmark();
      }
    });
    this.iconService.set().subscribe();
  }

  private saveBookmark() {
    this.getPost(false)
    .then(post => `https://pinboard.in/add?jump=close&url=${encodeURIComponent(post.url)}&title=${encodeURIComponent(post.description)}&description=${encodeURIComponent(post.extended)}`.substr(0, 2000))
    .then(url => this.optionsService.get().subscribe(options => 
      options.saveBookmarksInNewWindow 
        ? browser.windows.create({
          height: 550,
          width: 700,
          state: 'normal',
          type: 'panel',
          url: url
        })
        : browser.tabs.create({ 
          url: url 
        })
      )
    );
  }

  private readLater() {
    this.getPost(true)
    .then(post => this.optionsService.get().subscribe(options => 
        this.pinboardService.add(options.authToken, post).subscribe(() => {
          this.notificationService.message(chrome.i18n.getMessage('NT_SAVE'), post.url).subscribe()
        }, error => {
          let message = typeof error.message !== 'undefined' 
            ? error.message 
            : chrome.i18n.getMessage('NM_UNKNOWN_ERROR');
          this.notificationService.error(message).subscribe()
        })));
  }

  private getPost(toRead: boolean) : Promise<Post> {
    return browser.tabs.query({ currentWindow: true, active: true })
    .then(tabs => browser.tabs.executeScript(tabs[0].id, { code: "window.getSelection().toString().trim();" })
        .then(data => data.length > 0 && data[0] ? `${data[0]}` : '', _ => '')
        .then(extended => ({
            url: tabs[0].url,
            description: tabs[0].title,
            extended: extended,
            toRead: toRead
          }))
      );
  }
}
