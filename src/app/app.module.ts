import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule } from 'ng2-dragula';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component'
import { BackgroundComponent } from './background.component'
import { OptionsComponent } from './options.component';
import { PopupComponent } from './popup.component';
import { I18nDirective } from './i18n.directive';
import { IconService } from './icon.service';
import { OptionsService } from './options.service';
import { PinboardService } from './pinboard.service';
import { NotificationService } from './notification.service';

const appRoutes: Routes = [
  { path: 'background', component: BackgroundComponent },
  { path: 'options', component: OptionsComponent },
  { path: 'popup', component: PopupComponent },
  //{ path: 'save', component: SaveComponent },
  { path: '', redirectTo: 'popup', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    OptionsComponent,
    PopupComponent,
    I18nDirective
  ],
  imports: [
    BrowserModule,
    DragulaModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  providers: [
    HttpClient,
    IconService, 
    OptionsService, 
    PinboardService,
    NotificationService],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
