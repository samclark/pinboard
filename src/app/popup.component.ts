import { Component, OnInit } from '@angular/core';
import fontawesome from '@fortawesome/fontawesome';
import * as faStar from '@fortawesome/fontawesome-free-solid/faStar';

import { OptionsService } from './options.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  constructor(private optionsService: OptionsService) { }

  error: string = '';
  theme: string = '';
  user: string = '';
  menuItems: any[];
  saveBookmarksInNewWindow: boolean;

  ngOnInit() {
    fontawesome.library.add(faStar);
    this.optionsService.get().subscribe(options => {
      this.theme = options.theme;
      this.user = options.authToken.substring(0, options.authToken.indexOf(':'));
      this.menuItems = this.user
        ? options.menuItems.filter(mi => mi.enabled)
        : [{ key: 'SETUP', enabled: true }];
      this.saveBookmarksInNewWindow = options.saveBookmarksInNewWindow;
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
    browser.tabs.create({ url })
      .then(this.closePopups);
  }

  private saveBookmark() {
    browser.tabs.query({ currentWindow: true, active: true })
      .then(tabs =>       
        browser.tabs.executeScript(tabs[0].id, { code: "window.getSelection().toString().trim();" })
        .then(data => data.length > 0 && data[0] ? `&description=${data[0]}` : null, _ => null)
        .then(query => `https://pinboard.in/add?jump=close&url=${encodeURIComponent(tabs[0].url)}&title=${encodeURIComponent(tabs[0].title)}${query}`.substr(0, 2000))
        .then(url => {
          if (this.saveBookmarksInNewWindow) {
            browser.windows.create({
              height: 550,
              width: 700,
              state: 'normal',
              type: 'panel',
              url: url
            });
          } else {
            browser.tabs.create({ 
              url: url 
            });
          }
          this.closePopups();
        })
      );
  }

  private readLater() {
    browser.tabs.query({ currentWindow: true, active: true })
      .then(tabs => {
        if (tabs.length != 1) {
          throw new Error('Can not query current tab.');
        }
        browser.runtime.sendMessage({
          url: tabs[0].url,
          description: tabs[0].title,
          toRead: true         
        });
      })
      .then(this.closePopups);
  }

  private openOptions() {
    if (browser.runtime.openOptionsPage) {
      browser.runtime.openOptionsPage()
        .then(this.closePopups);
    } else {
      browser.tabs.create({url: browser.extension.getURL('index.html#/options')})
        .then(this.closePopups);
    }
  }

  private closePopups() {
    let popups = browser.extension.getViews({ type: 'popup' });
    popups.forEach(popup => popup.close());
  };
}
