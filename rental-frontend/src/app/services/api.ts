import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:5000/api/v1';

  constructor(private http: HttpClient) {}

  getListings() {
    return this.http.get(`${this.baseUrl}/listings`);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  addListing(data: any, token: string) {
    return this.http.post(`${this.baseUrl}/listings`, data, {
      headers: { 'x-access-token': token }
    });
  }
}