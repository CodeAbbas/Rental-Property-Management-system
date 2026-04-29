import { Routes } from '@angular/router';
import { ListingsComponent } from './pages/listings/listings';
import { LoginComponent } from './pages/login/login';
import { AddListingComponent } from './pages/add-listing/add-listing';

export const routes: Routes = [
  { path: '', component: ListingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add', component: AddListingComponent }
];