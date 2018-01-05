import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AdaptiveModule } from '@betadigitalproduction/ngx-image-preload-service';

import { AppComponent }  from './app.component';
import { PlatformModule } from '@betadigitalproduction/ngx-platform-service';
import { ViewportModule } from '@betadigitalproduction/ngx-viewport-service';

@NgModule({
  imports: [
    BrowserModule,
    PlatformModule,
    ViewportModule,
    AdaptiveModule
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
