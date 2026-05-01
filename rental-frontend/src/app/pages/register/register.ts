import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  registerData = { username: '', password: '' };

  constructor(private api: ApiService, private router: Router) {}

  register() {
    if (!this.registerData.username || !this.registerData.password) {
      alert("Username and password are required");
      return;
    }

    this.api.register(this.registerData).subscribe({
      next: () => {
        alert("Registration successful. Please login.");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("Registration error:", err);
        alert("Registration failed");
      }
    });
  }
}

export { RegisterComponent as Register };
