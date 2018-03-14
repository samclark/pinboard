import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragulaService } from 'ng2-dragula';

import { Options } from './options'
import { OptionsService } from './options.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  constructor(private dragulaService: DragulaService, private optionsService: OptionsService) { }

  loaded: boolean = false;
  error: string = '';
  options: Options;
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

    this.dragulaService.dropModel.subscribe(_ => {

    });
  }

  save() {
    this.error = '';
    this.optionsService.set(this.options)
      .subscribe(null, error => {
        this.error = error.message || 'Unknown error.';
      });
  }
}
