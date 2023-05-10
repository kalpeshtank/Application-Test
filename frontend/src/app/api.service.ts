import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  // Fetch data from the API
  getData(url: string) {
    return this.http.get(environment.APP_URL + url);
  }
  // Create a new record using the API
  create(url: string, data: any) {
    return this.http.post(environment.APP_URL + url, data);
  }
  // Update an existing record using the API
  update(url: string, data: any) {
    return this.http.put(environment.APP_URL + url, data);
  }
  // Delete a record using the API
  delete(url: string) {
    return this.http.delete(environment.APP_URL + url);
  }
}
