import { Component, OnInit, Input, Output } from '@angular/core';
import fontawesome from '@fortawesome/fontawesome';
import * as faStar from '@fortawesome/fontawesome-free-solid/faStar';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map';
 
import { OptionsService } from './options.service';
import { Post } from './post'

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  constructor(private optionsService: OptionsService) { }

  error: string = '';
  theme: string = 'dark';
  user: string = '';
  menuItems: any[];

  ngOnInit() {
    fontawesome.library.add(faStar);
    this.optionsService.get().subscribe(options => {
      this.theme = options.theme;
      this.user = options.authToken.substring(0, options.authToken.indexOf(':'));
      if (!this.user) {
        this.menuItems = [{ key: 'SETUP', enabled: true }];
      }
      else {
        this.menuItems = options.menuItems
          .filter(mi => mi.enabled);
      }
    }, error => {
      this.error = error.message || 'Unknown error.';
    });
  }

  menuItemClicked(key: string) {
    switch (key) {
      case 'ALL':
        this.openUrl(`https://pinboard.in/u:${this.user}/`);
        break;
      case 'PRIVATE':
        this.openUrl(`https://pinboard.in/u:${this.user}/private/`);
        break;
      case 'UNREAD':
        this.openUrl(`https://pinboard.in/u:${this.user}/unread/`);
        break;
      case 'STARRED':
        this.openUrl(`https://pinboard.in/u:${this.user}/starred/`);
        break;
      case 'NETWORK':
        this.openUrl('https://pinboard.in/network/');
        break;
      case 'RECENT':
        this.openUrl('https://pinboard.in/recent/');
        break
      case 'POPULAR':
        this.openUrl('https://pinboard.in/popular/');
        break;
      case 'NOTES':
        this.openUrl(`https://pinboard.in/u:${this.user}/from:notes/`);
        break;
      case 'SAVE_BOOKMARK':
        this.saveBookmark();
        break;
      case 'READ_LATER':
        this.readLater();
        break;
      case 'SETUP':
      case 'OPTIONS':
        this.openOptions();
        break;
    }
  }

  private openUrl(url: string) {
    browser.tabs.create({ url });
    this.closePopups();
  }

  private saveBookmark() {
    Observable.fromPromise(browser.tabs.query({ currentWindow: true, active: true }))
      .subscribe(tabs => {
        if (tabs.length != 1)
          throw new Error('Can not quert current tab.');
        Observable.fromPromise(browser.tabs.executeScript(tabs[0].id, { code: "window.getSelection().toString().trim();" }))
          .subscribe(data => {
            let url: String;
            if (data.length > 0 && data[0]) {
              url = `https://pinboard.in/add?jump=close&url=${encodeURIComponent(tabs[0].url)}&title=${encodeURIComponent(tabs[0].title)}&description=${data[0]}`;
            } else {
              url = `https://pinboard.in/add?jump=close&url=${encodeURIComponent(tabs[0].url)}&title=${encodeURIComponent(tabs[0].title)}`;
            }
            browser.windows.create({
              height: 550,
              width: 700,
              state: 'normal',
              type: 'panel',
              url: url.substr(0, 2000)
            });
          }, error => {
            browser.windows.create({
              height: 550,
              width: 700,
              state: 'normal',
              type: 'panel',
              url: `https://pinboard.in/add?jump=close&url=${encodeURIComponent(tabs[0].url)}&title=${encodeURIComponent(tabs[0].title)}`.substr(0, 2000)
            });
          });
        this.closePopups();
      });
  }

  private readLater() {
    Observable.fromPromise(browser.tabs.query({ currentWindow: true, active: true }))
      .subscribe(data => {
        if (data.length != 1)
          throw new Error('Can not quert current tab.');
        let post = new Post();
        post.url = data[0].url;
        post.description = data[0].title;
        post.toRead = true;
        browser.runtime.sendMessage(post);
        this.closePopups();
      });
  }

  private openOptions() {
    if (browser.runtime.openOptionsPage) {
      Observable.fromPromise(browser.runtime.openOptionsPage()).subscribe();
    } else {
      browser.tabs.create({ url: browser.extension.getURL('index.html#/options') });
    }
    this.closePopups();
  }

  private closePopups() {
    let popups = browser.extension.getViews({ type: 'popup' });
    popups.forEach(popup => popup.close());
  };
}
