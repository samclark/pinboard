import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

import { Options } from './options'
import { IconService } from './icon.service';
import { OptionsService } from './options.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  constructor(private dragulaService: DragulaService, 
    private iconService: IconService, 
    private optionsService: OptionsService) { }

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
    this.dragulaService.dropModel.subscribe(x => {

    });
  }

  save() {
    this.error = '';
    this.saving = true;
    this.optionsService.set(this.options)
      .flatMap(() => this.iconService.set())
      .subscribe(null, error => {
        this.error = error.message || 'Unknown error.';
      });
    this.saving = false;
  }
}
