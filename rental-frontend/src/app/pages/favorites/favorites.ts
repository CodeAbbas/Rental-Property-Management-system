import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.html'
})
export class FavoritesComponent implements OnInit {

  favorites: any[] = [];

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const token = this.auth.getToken();

    if (!token) {
      alert("Please login first!");
      return;
    }

    this.api.getFavorites(token).subscribe({
      next: (favRes: any) => {
        const favoriteIds = favRes.favorites || [];
        this.favorites = [];

        favoriteIds.forEach((id: string) => {
          this.api.getListing(id).subscribe({
            next: (listing: any) => {
              this.favorites.push(listing);
            },
            error: (err) => {
              console.error("Error loading favorite listing:", err);
            }
          });
        });
      },
      error: (err) => {
        console.error("Error loading favorites:", err);
        alert("Error loading favorites");
      }
    });
  }
}

export { FavoritesComponent as Favorites };
