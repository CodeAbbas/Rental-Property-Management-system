import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', component: ListingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add', component: AddListingComponent, canActivate: [authGuard] }
];