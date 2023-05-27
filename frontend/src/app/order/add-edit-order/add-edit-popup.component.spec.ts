import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AddEditPopupComponent } from './add-edit-popup.component';
import Swal from 'sweetalert2';

describe('AddEditPopupComponent', () => {
  let component: AddEditPopupComponent;
  let fixture: ComponentFixture<AddEditPopupComponent>;
  let apiService: ApiService;
  let matDialogRef: MatDialogRef<AddEditPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditPopupComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: MatDialogRef,
          useValue: jasmine.createSpyObj('MatDialogRef', ['close'])
        },
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj('ApiService', ['createOrder', 'updateOrder'])
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPopupComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    matDialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addRecord', () => {
    it('should create a new order record', () => {
      const mockFormValue = {
        name: 'Order 1',
        state: 'State 1',
        zip: '12345',
        amount: 500,
        qty: 50,
        item: 'Item 1'
      };

      const mockApiResponse = {
        status: 200,
        message: 'Order created successfully'
      };

      spyOn(Swal, 'fire').and.stub();
      spyOn(apiService, 'createOrder').and.returnValue(of(mockApiResponse));

      component.orderDataForm.setValue(mockFormValue);
      component.addRecord();

      expect(apiService.createOrder).toHaveBeenCalledWith('order', mockFormValue);
      expect(Swal.fire).toHaveBeenCalledWith('Created!', mockApiResponse.message, 'success');
      expect(matDialogRef.close).toHaveBeenCalledWith(true);
      expect(component.loading).toBe(false);
    });

    it('should handle error when creating a new order record', () => {
      const mockFormValue = {
        name: 'Order 1',
        state: 'State 1',
        zip: '12345',
        amount: 500,
        qty: 50,
        item: 'Item 1'
      };

      const mockError = {
        error: {
          data: {
            field1: 'Error message 1',
            field2: 'Error message 2'
          }
        }
      };

      spyOn(Swal, 'fire').and.stub();
      spyOn(apiService, 'createOrder').and.returnValue(throwError(mockError));

      component.orderDataForm.setValue(mockFormValue);
      component.addRecord();

      expect(apiService.createOrder).toHaveBeenCalledWith('order', mockFormValue);
      expect(Swal.fire).toHaveBeenCalledWith('Error!', 'Error message 1, Error message 2', 'error');
      expect(matDialogRef.close).not.toHaveBeenCalled();
      expect(component.loading).toBe(false);
    });
  });

  describe('updateRecord', () => {
    it('should update an existing order record', () => {
      const mockFormValue = {
        name: 'Order 1',
        state: 'State 1',
        zip: '12345',
        amount: 500,
        qty: 50,
        item: 'Item 1'
      };

      const mockApiResponse = {
        status: 200,
        message: 'Order updated successfully'
      };

      spyOn(Swal, 'fire').and.stub();
      spyOn(apiService, 'updateOrder').and.returnValue(of(mockApiResponse));

      component.orderDataForm.setValue(mockFormValue);
      component.id = '1'; // Set the ID for an existing order
      component.updateRecord();

      expect(apiService.updateOrder).toHaveBeenCalledWith('order/1', mockFormValue);
      expect(Swal.fire).toHaveBeenCalledWith('Updated!', mockApiResponse.message, 'success');
      expect(matDialogRef.close).toHaveBeenCalledWith(true);
      expect(component.loading).toBe(false);
    });

    it('should handle error when updating an existing order record', () => {
      const mockFormValue = {
        name: 'Order 1',
        state: 'State 1',
        zip: '12345',
        amount: 500,
        qty: 50,
        item: 'Item 1'
      };

      const mockError = {
        error: {
          data: {
            field1: 'Error message 1',
            field2: 'Error message 2'
          }
        }
      };

      spyOn(Swal, 'fire').and.stub();
      spyOn(apiService, 'updateOrder').and.returnValue(throwError(mockError));

      component.orderDataForm.setValue(mockFormValue);
      component.id = '1'; // Set the ID for an existing order
      component.updateRecord();

      expect(apiService.updateOrder).toHaveBeenCalledWith('order/1', mockFormValue);
      expect(Swal.fire).toHaveBeenCalledWith('Error!', 'Error message 1, Error message 2', 'error');
      expect(matDialogRef.close).not.toHaveBeenCalled();
      expect(component.loading).toBe(false);
    });
  });
});
