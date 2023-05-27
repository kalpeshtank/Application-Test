import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch data from the API', () => {
    const mockData = { id: 1, name: 'Example' };

    service.getOrderData('/orders').subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpTestingController.expectOne(environment.APP_URL + '/orders');
    expect(req.request.method).toEqual('GET');
    req.flush(mockData);
  });

  it('should create a new record using the API', () => {
    const mockData = { id: 1, name: 'Example' };

    service.createOrder('/orders', mockData).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpTestingController.expectOne(environment.APP_URL + '/orders');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(mockData);
  });

  // Write similar test cases for updateOrder and deleteOrder methods

  it('should set and get the title', () => {
    const mockTitle = 'Test Title';

    service.setTitle(mockTitle);
    service.getTitle().subscribe(title => {
      expect(title).toEqual(mockTitle);
    });
  });
});
