import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:5000/api/v1';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'x-access-token': token
    };
  }

  getListings() {
    return this.http.get(`${this.baseUrl}/listings`);
  }

  getListing(id: string) {
    return this.http.get(`${this.baseUrl}/listings/${id}`);
  }

  searchListings(query: string) {
    return this.http.get(`${this.baseUrl}/listings/search?q=${encodeURIComponent(query)}`);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  addListing(data: any, token: string) {
    return this.http.post(`${this.baseUrl}/listings`, data, {
      headers: this.getAuthHeaders(token)
    });
  }

  updateListing(id: string, data: any, token: string) {
    return this.http.put(`${this.baseUrl}/listings/${id}`, data, {
      headers: this.getAuthHeaders(token)
    });
  }

  deleteListing(id: string, token: string) {
    return this.http.delete(`${this.baseUrl}/listings/${id}`, {
      headers: this.getAuthHeaders(token)
    });
  }

  getFavorites(token: string) {
    return this.http.get(`${this.baseUrl}/user/favorites`, {
      headers: this.getAuthHeaders(token)
    });
  }

  addFavorite(id: string, token: string) {
    return this.http.post(`${this.baseUrl}/user/favorites/${id}`, {}, {
      headers: this.getAuthHeaders(token)
    });
  }

  getAvgRent(token: string) {
    return this.http.get(`${this.baseUrl}/analytics/average-rent`, {
      headers: this.getAuthHeaders(token)
    });
  }

  getPopularTypes(token: string) {
    return this.http.get(`${this.baseUrl}/analytics/popular-types`, {
      headers: this.getAuthHeaders(token)
    });
  }
}
