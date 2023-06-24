import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { OrderInterface } from './order/order-interface';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve order data from the API', () => {
    const dummyData: OrderInterface[] = [
      { id: 1, name: 'Order 1', item: 'Item 1', amount: 10, qty: 2, state: 'State 1', zip: 12345 },
      { id: 2, name: 'Order 2', item: 'Item 2', amount: 20, qty: 4, state: 'State 2', zip: 67890 },
    ];
    const url = '/orders';

    service.getOrderData(url).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(environment.APP_URL + url);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should create a new order using the API', () => {
    const orderData: OrderInterface = { name: 'New Order', item: 'New Item', amount: 30, qty: 3, state: 'New State', zip: 54321 };
    const url = '/orders';

    service.createOrder(url, orderData).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(environment.APP_URL + url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(orderData);
    req.flush({});
  });

  it('should update an existing order using the API', () => {
    const orderData: OrderInterface = { id: 1, name: 'Updated Order', item: 'Updated Item', amount: 40, qty: 5, state: 'Updated State', zip: 98765 };
    const url = '/orders/1';

    service.updateOrder(url, orderData).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(environment.APP_URL + url);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(orderData);
    req.flush({});
  });

  it('should delete a record using the API', () => {
    const orderId = 1;
    const url = '/orders/' + orderId;

    service.deleteOrder(url).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(request => request.url === environment.APP_URL + url && request.method === 'DELETE');
    req.flush({}, { status: 200, statusText: 'OK' }); // Simulate a successful response
  });

  it('should delete multiple records using the API', () => {
    const orderIds = [1, 2, 3];
    const url = '/orders';

    service.deleteOrder(url, orderIds).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(request => request.url === environment.APP_URL + url && request.method === 'DELETE');
    expect(req.request.params.get('orderIds')).toBe('1,2,3');
    req.flush({});
  });

  it('should set and get the title', () => {
    const newTitle = 'New Title';

    service.setTitle(newTitle);
    service.getTitle().subscribe(title => {
      expect(title).toBe(newTitle);
    });
  });
});
