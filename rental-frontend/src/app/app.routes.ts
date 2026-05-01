import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
import { ListingsComponent } from './pages/listings/listings';
import { LoginComponent } from './pages/login/login';
import { AddListingComponent } from './pages/add-listing/add-listing';
import { FavoritesComponent } from './pages/favorites/favorites';
import { AnalyticsComponent } from './pages/analytics/analytics';

export const routes: Routes = [
  { path: '', component: ListingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add', component: AddListingComponent, canActivate: [authGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [authGuard] }
];
