import { Component } from '@angular/core';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {

  loginData = { username: '', password: '' };

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.api.login(this.loginData).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);
        alert("Login successful");

        // ✅ Redirect after login
        this.router.navigate(['/']);
      },
      error: () => alert("Login failed")
    });
  }
}
