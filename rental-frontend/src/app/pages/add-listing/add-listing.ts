import { Component } from '@angular/core';
import { ApiService } from '../../services/api'; // Note: your file is api.ts
import { AuthService } from '../../services/auth'; // Note: your file is auth.ts
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-listing.html'
})
export class AddListingComponent {
  newListing = { title: '', location: '', price_pcm: 0 };

  constructor(private api: ApiService, private auth: AuthService) {}

addListing() {
  const token = this.auth.getToken();

  if (!token) {
    alert("Please login first!");
    return;
  }

  if (!this.newListing.title || !this.newListing.location || !this.newListing.price_pcm) {
    alert("All fields required");
    return;
  }

  this.api.addListing(this.newListing, token).subscribe({
    next: (res) => {
      alert("Listing added successfully!");
      console.log(res);
    },
    error: (err) => {
      console.error(err);
      alert("Error adding listing");
    }
  });
}
}
