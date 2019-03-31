import { Component, OnInit } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { debounce, mergeMap } from 'rxjs/operators';
import { DragulaService } from 'ng2-dragula';

import { IconService } from './icon.service';
import { OptionsService } from './options.service';
import { Options } from './options'

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  constructor(private dragulaService: DragulaService, 
    private iconService: IconService, 
    private optionsService: OptionsService) { }
  
  subs: Subscription = new Subscription();
  onChange: Subject<void> = new Subject<void>();
  loaded: boolean = false;
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
      .subscribe(() => {
        this.error = '';
        this.optionsService.set(this.options).pipe(
          mergeMap(() => this.iconService.set()))
          .subscribe(null, error => {
            this.error = error.message || 'Unknown error.';
          });
      });
  }

  ngOnDestroy() { 
    this.subs.unsubscribe(); 
  }
}
