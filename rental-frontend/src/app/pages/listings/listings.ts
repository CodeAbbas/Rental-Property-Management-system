import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listings.html'
})
export class ListingsComponent implements OnInit {

  listings: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    console.log("Listings component loaded");

    this.api.getListings().subscribe({
      next: (res: any) => {
        console.log("API Response:", res);
        this.listings = res;
      },
      error: (err) => {
        console.error("Error fetching listings:", err);
      }
    });
  }
}