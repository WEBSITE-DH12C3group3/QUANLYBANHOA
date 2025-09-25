import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { FeaturePlaceholderComponent } from './features/feature-placeholder.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule) }, // hoặc .module
  { path: '**', redirectTo: '' }
];
