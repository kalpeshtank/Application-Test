import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { AddEditPopupComponent } from './add-edit-order/add-edit-popup.component';
import { ApiService } from '../api.service';
import { OrderComponent } from './order.component';
import { OrderInterface } from './order-interface';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<AddEditPopupComponent>>;
  let swalFireSpy: jasmine.Spy<any>;

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getOrderData', 'deleteOrder']);
    matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    swalFireSpy = spyOn(Swal, 'fire');

    await TestBed.configureTestingModule({
      declarations: [OrderComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        {
          provide: MatDialog,
          useValue: {
            open: () => matDialogRefSpy
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display order data', () => {
    const mockData: OrderInterface[] = [
      { id: 1, name: 'Order 1', item: 'Item 1', amount: 10, qty: 2, state: 'State 1', zip: 12345 }
    ];
    apiServiceSpy.getOrderData.and.returnValue(of({ status: 200, data: { headers: [], data: mockData } }));

    component.getTableData();

    expect(apiServiceSpy.getOrderData).toHaveBeenCalledWith('orders');
    expect(component.displayedColumns).toEqual(['checkbox', 'Actions']);
    expect(component.tableRowData).toEqual(mockData);
    expect(component.orderData.dataSource).toEqual(new MatTableDataSource<OrderInterface>(mockData));
    expect(component.orderData.length).toBe(mockData.length);
    expect(component.orderData.hasOwnProperty('_paginator')).toBeFalsy(); // Check if _paginator property does not exist
    expect(component.orderData.hasOwnProperty('_sort')).toBeFalsy(); // Check if _sort property does not exist
  });


  it('should handle error when fetching order data', () => {
    const errorResponse = {
      error: {
        data: { message: 'Error message' }
      }
    };
    apiServiceSpy.getOrderData.and.returnValue(of(errorResponse));

    component.getTableData();

    expect(apiServiceSpy.getOrderData).toHaveBeenCalledWith('orders');
    expect(component.displayedColumns).toEqual([]);
    expect(component.orderData.dataSource).toEqual(new MatTableDataSource<OrderInterface>([]));
    expect(component.orderData.length).toBe(0);
    expect(swalFireSpy).toHaveBeenCalledWith('Error!', 'Error message', 'error');
  });

  it('should open add order dialog', () => {
    matDialogRefSpy.afterClosed.and.returnValue(of(true));

    component.addOrder();

    expect(matDialogRefSpy.afterClosed).toHaveBeenCalled();
    expect(apiServiceSpy.getOrderData).toHaveBeenCalled(); // Assuming this is called to refresh the data
  });

  it('should open edit order dialog', () => {
    const mockData: OrderInterface = { id: 1, name: 'Order 1', item: 'Item 1', amount: 10, qty: 2, state: 'State 1', zip: 12345 };
    matDialogRefSpy.afterClosed.and.returnValue(of(true));

    component.editOrder(mockData);

    expect(matDialogRefSpy.afterClosed).toHaveBeenCalled();
    expect(apiServiceSpy.getOrderData).toHaveBeenCalled(); // Assuming this is called to refresh the data
  });
});
