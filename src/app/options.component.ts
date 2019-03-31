
import {mergeMap, debounce} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

import { Options } from './options'
import { IconService } from './icon.service';
import { OptionsService } from './options.service';
import { Subscription, timer, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  constructor(private dragulaService: DragulaService, 
    private iconService: IconService, 
    private optionsService: OptionsService) { }
  
  onChange: Subject<void> = new Subject<void>();
  subs: Subscription = new Subscription();
  loaded: boolean = false;
  saving: boolean = false;
  error: string = '';
  options: Options;
  themes = [
    'LIGHT',
    'DARK'
  ];
  privacyOverrides = [
    'DEFAULT',
    'PUBLIC',
    'PRIVATE'
  ];

  ngOnInit() {
    this.optionsService.get().subscribe(options => {
      this.options = options;
      this.loaded = true;
    }, error => {
      this.error = error.message || 'Unknown error.';
    });
    this.subs.add(this.dragulaService.dropModel("menu")
      .subscribe(() => {
        this.onChange.next();
      })
    );
    this.onChange
      .pipe(debounce(() => timer(250)))
      .subscribe(() => this.save());
  }

  ngOnDestroy() { 
    this.subs.unsubscribe(); 
  }

  save() {
    console.log('save');
    this.error = '';
    this.saving = true;
    this.optionsService.set(this.options).pipe(
      mergeMap(() => this.iconService.set()))
      .subscribe(null, error => {
        this.error = error.message || 'Unknown error.';
      });
    this.saving = false;
  }
}
