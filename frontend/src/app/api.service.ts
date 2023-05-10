import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  getData(url: string) {
    return this.http.get(environment.APP_URL + url);
  }
  create(url: string, data: any) {
    return this.http.post(environment.APP_URL + url, data);
  }

  update(url: string, data: any) {
    return this.http.put(environment.APP_URL + url, data);
  }

  delete(url: string) {
    return this.http.delete(environment.APP_URL + url);
  }
}
