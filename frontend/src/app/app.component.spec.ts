import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppComponent } from './app.component';
import { ApiService } from './api.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getTitle']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title from ApiService', () => {
    const mockTitle = 'Test Title';
    apiServiceSpy.getTitle.and.returnValue(new BehaviorSubject<string>(mockTitle));

    fixture.detectChanges();

    expect(component.title).toEqual(mockTitle);
  });

  it('should unsubscribe from observables on component destruction', () => {
    const unsubscribeSpy = spyOn(component.destroy$, 'next');
    const completeSpy = spyOn(component.destroy$, 'complete');

    fixture.destroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
