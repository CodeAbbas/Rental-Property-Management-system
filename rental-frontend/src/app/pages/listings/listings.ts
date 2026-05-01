import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listings.html'
})
export class ListingsComponent implements OnInit {

  listings: any[] = [];
  searchText = '';

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    console.log("Listings component loaded");
    this.loadListings();
  }

  loadListings() {
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

  addToFav(id: string) {
    const token = this.auth.getToken();

    if (!token) {
      alert("Please login first!");
      return;
    }

    this.api.addFavorite(id, token).subscribe({
      next: () => {
        alert("Added to favorites!");
      },
      error: (err) => {
        console.error("Error adding favorite:", err);
        alert("Error adding favorite");
      }
    });
  }

  search() {
    const query = this.searchText.trim();

    if (!query) {
      this.loadListings();
      return;
    }

    this.api.searchListings(query).subscribe({
      next: (res: any) => {
        this.listings = res;
      },
      error: (err) => {
        console.error("Error searching listings:", err);
      }
    });
  }
}
