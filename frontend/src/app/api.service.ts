import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderInterface } from './order/order-interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('Green IT Application Challenge');

  constructor(private http: HttpClient) { }
  // Fetch orderData from the API
  getOrderData(url: string) {
    return this.http.get(environment.APP_URL + url);
  }
  // Create a new record using the API
  createOrder(url: string, orderData: OrderInterface) {
    return this.http.post(environment.APP_URL + url, orderData);
  }
  // Update an existing record using the API
  updateOrder(url: string, orderData: OrderInterface) {
    return this.http.put(environment.APP_URL + url, orderData);
  }
  // Delete a record using the API
  deleteOrder(url: string, orderId: (number | undefined)[] = []) {
    // Create the request headers
    const headers = new HttpHeaders();
    let params: HttpParams = new HttpParams(); // Initialize with an empty HttpParams object
    if (Array.isArray(orderId)) {
      params = params.set('orderIds', orderId.join(','));
    }
    return this.http.delete(environment.APP_URL + url, { headers, params });
  }
  setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  getTitle(): Observable<string> {
    return this.titleSubject.asObservable();
  }
}
