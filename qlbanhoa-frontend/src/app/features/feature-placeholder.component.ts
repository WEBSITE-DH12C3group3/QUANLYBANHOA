import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feature-placeholder',
  templateUrl: './feature-placeholder.component.html'
})
export class FeaturePlaceholderComponent {
  title = 'Feature';
  constructor(route: ActivatedRoute) {
    route.data.subscribe(d => this.title = d['title'] ?? 'Feature');
  }
}
