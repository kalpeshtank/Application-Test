import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('GreenIT Application Challenge');

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
  delete(url: string, data: any = []) {
    // Create the request headers
    const headers = new HttpHeaders();
    // Create the request parameters
    const params = new HttpParams().set('orderIds', data.join(','));
    return this.http.delete(environment.APP_URL + url, { headers, params });
  }
  setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  getTitle(): Observable<string> {
    return this.titleSubject.asObservable();
  }
}
