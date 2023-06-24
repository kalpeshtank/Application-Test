import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { AddEditPopupComponent } from './add-edit-popup.component';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('AddEditPopupComponent', () => {
  let component: AddEditPopupComponent;
  let fixture: ComponentFixture<AddEditPopupComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AddEditPopupComponent>>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  const orderItem: any = { data: { id: '1', name: 'Test', state: 'State', zip: '12345', amount: '10.5', qty: '1', item: 'Item' }, type: 'edit' };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['createOrder', 'updateOrder']);

    await TestBed.configureTestingModule({
      declarations: [AddEditPopupComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: orderItem },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: ApiService, useValue: apiServiceSpy },
        FormBuilder,
      ],
    }).compileComponents();

    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AddEditPopupComponent>>;
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture = TestBed.createComponent(AddEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly for editing an order', () => {
    expect(component.title).toBe('Edit order');
    expect(component.orderDataForm.value).toEqual({
      name: orderItem.data.name,
      state: orderItem.data.state,
      zip: orderItem.data.zip,
      amount: orderItem.data.amount,
      qty: orderItem.data.qty,
      item: orderItem.data.item,
    });
  });

  it('should initialize the form correctly for creating an order', () => {
    const newItemOrderItem: any = { type: 'create' };
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: newItemOrderItem });

    fixture = TestBed.createComponent(AddEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.title).toBe('Create order');
    expect(component.orderDataForm.value).toEqual({
      name: '',
      state: '',
      zip: '',
      amount: '',
      qty: '',
      item: '',
    });
  });

  it('should add a new order record', () => {
    mockApiService.createOrder.and.returnValue(of({ status: 200, message: 'Order created' }));

    component.addRecord();

    expect(component.loading).toBe(false);
    expect(mockApiService.createOrder).toHaveBeenCalledWith('order', component.orderDataForm.value);
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    expect(component.loading).toBe(false);
  });

  it('should handle error when adding a new order record', () => {
    const errorMessage = 'An error occurred';
    const errorResponse = { error: { message: errorMessage } };
    mockApiService.createOrder.and.returnValue(throwError(errorResponse));

    component.addRecord();

    expect(component.loading).toBe(true);
    expect(mockApiService.createOrder).toHaveBeenCalledWith('order', component.orderDataForm.value);
    expect(mockDialogRef.close).not.toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(Swal.fire).toHaveBeenCalledWith('Error!', errorMessage, 'error');
  });

  it('should update an existing order record', () => {
    mockApiService.updateOrder.and.returnValue(of({ status: 200, message: 'Order updated' }));

    component.updateRecord();

    expect(component.loading).toBe(false);
    expect(mockApiService.updateOrder).toHaveBeenCalledWith('order/' + component.id, component.orderDataForm.value);
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    expect(component.loading).toBe(false);
  });

  it('should handle error when updating an existing order record', () => {
    const errorMessage = 'An error occurred';
    const errorResponse = { error: { message: errorMessage } };
    spyOn(mockApiService, 'updateOrder').and.returnValue(throwError(errorResponse));

    component.updateRecord();

    expect(component.loading).toBe(false);
    expect(mockApiService.updateOrder).toHaveBeenCalledWith('order/' + component.id, component.orderDataForm.value);
    expect(mockDialogRef.close).not.toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(Swal.fire).toHaveBeenCalledWith('Error!', errorMessage, 'error');
  });

});
