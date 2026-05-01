import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html'
})
export class AnalyticsComponent implements OnInit {

  averageRent: any[] = [];
  popularTypes: any[] = [];

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    const token = this.auth.getToken();

    if (!token) {
      alert("Please login first!");
      return;
    }

    this.api.getAvgRent(token).subscribe({
      next: (res: any) => {
        this.averageRent = res;
      },
      error: (err) => {
        console.error("Error loading average rent:", err);
      }
    });

    this.api.getPopularTypes(token).subscribe({
      next: (res: any) => {
        this.popularTypes = res;
      },
      error: (err) => {
        console.error("Error loading popular types:", err);
      }
    });
  }
}
