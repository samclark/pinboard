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
    return browser.tabs.create({ url })
      .then(this.closePopups);
  }

  private saveBookmark() {
    return browser.runtime.sendMessage({
      command: 'save-bookmark'
    })
    .then(this.closePopups);
  }

  private readLater() {
    return browser.runtime.sendMessage({
      command: 'read-later'
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
