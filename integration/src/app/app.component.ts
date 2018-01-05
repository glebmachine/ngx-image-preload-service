import { Component } from '@angular/core';
import { AdaptiveService } from 'platform-service';

@Component({
  selector: 'integration-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  meaning: number;
  constructor(libService: AdaptiveService) {
    this.meaning = libService.getMeaning();
  }
}
