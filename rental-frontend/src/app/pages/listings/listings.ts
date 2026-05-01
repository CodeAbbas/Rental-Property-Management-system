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
  loading = false;
  editingId = '';
  editListingData = { title: '', location: '', price_pcm: 0 };

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    this.loadListings();
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  loadListings() {
    this.loading = true;

    this.api.getListings().subscribe({
      next: (res: any) => {
        this.listings = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        console.error("Error fetching listings:", err);
        this.loading = false;
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
        this.listings = Array.isArray(res) ? res : [];
      },
      error: (err) => {
        console.error("Error searching listings:", err);
      }
    });
  }

  startEdit(item: any) {
    this.editingId = item._id;
    this.editListingData = {
      title: item.title,
      location: item.location,
      price_pcm: item.price_pcm
    };
  }

  cancelEdit() {
    this.editingId = '';
    this.editListingData = { title: '', location: '', price_pcm: 0 };
  }

  updateListing(id: string) {
    const token = this.auth.getToken();

    if (!token) {
      alert("Please login first!");
      return;
    }

    if (!this.editListingData.title || !this.editListingData.location || !this.editListingData.price_pcm) {
      alert("All fields required");
      return;
    }

    this.api.updateListing(id, this.editListingData, token).subscribe({
      next: () => {
        alert("Listing updated successfully!");
        this.cancelEdit();
        this.loadListings();
      },
      error: (err) => {
        console.error("Error updating listing:", err);
        alert("Error updating listing");
      }
    });
  }

  deleteListing(id: string) {
    const token = this.auth.getToken();

    if (!token) {
      alert("Please login first!");
      return;
    }

    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    this.api.deleteListing(id, token).subscribe({
      next: () => {
        alert("Listing deleted successfully!");
        this.loadListings();
      },
      error: (err) => {
        console.error("Error deleting listing:", err);
        alert("Error deleting listing");
      }
    });
  }
}
