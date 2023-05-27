import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import { AddEditPopupComponent } from './add-edit-order/add-edit-popup.component';
import { OrderComponent } from './order.component';
import { OrderInterface } from './order-interface';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { of, throwError } from 'rxjs';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let apiData: ApiService;
  let dialog: MatDialog;

  beforeEach(async () => {
    const apiServiceMock = jasmine.createSpyObj('ApiService', ['getOrderData', 'createOrder', 'updateOrder', 'deleteOrder']);

    await TestBed.configureTestingModule({
      declarations: [OrderComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        {
          provide: MatDialog,
          useValue: {
            open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of(true) }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    apiData = TestBed.inject(ApiService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch table data on initialization', () => {
    const mockOrderData: OrderInterface[] = [
      {
        id: 1,
        name: 'Order 1',
        item: 'Order 1',
        amount: 500,
        qty: 50,
        state: '5',
        zip: 5696
      }
    ];

    const getOrderDataSpy = spyOn(apiData, 'getOrderData').and.returnValue(
      of({ status: 200, data: { headers: [], data: mockOrderData } })
    );

    component.ngOnInit();

    expect(getOrderDataSpy).toHaveBeenCalledWith('orders');
    expect(component.displayedColumns).toEqual(['checkbox', 'Actions']);
    expect(component.tableRowData).toEqual(mockOrderData);
    expect(component.tableObj.dataSource).toEqual(new MatTableDataSource<OrderInterface>(mockOrderData));
    expect(component.tableObj.length).toBe(1);
    expect(component.tableObj.dataSource.paginator).toEqual(component.paginator);
    expect(component.tableObj.dataSource.sort).toEqual(component.sort);
    expect(component.loading).toBe(false);
  });

  it('should handle error on fetching table data', () => {
    const errorMessage = 'Failed to fetch data';

    const getOrderDataSpy = spyOn(apiData, 'getOrderData').and.returnValue(
      throwError({ error: { message: errorMessage } })
    );

    const SwalFireSpy = spyOn(Swal, 'fire');

    component.ngOnInit();

    expect(getOrderDataSpy).toHaveBeenCalledWith('orders');
    expect(component.displayedColumns).toEqual([]);
    expect(component.tableObj.dataSource).toEqual(new MatTableDataSource<OrderInterface>([]));
    expect(component.tableObj.length).toBe(0);
    expect(component.loading).toBe(false);
    expect(SwalFireSpy).toHaveBeenCalledWith('Error!', errorMessage, 'error');
  });

  it('should filter data based on search query', () => {
    const eventData = 'order';

    component.tableObj.dataSource = new MatTableDataSource<OrderInterface>([
      {
        id: 1,
        name: 'Order 1',
        item: 'Order 1',
        amount: 500,
        qty: 50,
        state: '5',
        zip: 5696
      },
      {
        id: 2,
        name: 'Order 2',
        item: 'Order 2',
        amount: 1000,
        qty: 20,
        state: '3',
        zip: 12345
      },
    ]);

    const filterSpy = spyOn<any>(component.tableObj.dataSource, 'filter');
    component.searchData(eventData);
    expect(filterSpy).toHaveBeenCalledWith(eventData.trim().toLowerCase());
  });

  it('should open edit order dialog and refresh table data on closing', () => {
    const mockOrder: OrderInterface = {
      id: 1,
      name: 'Order 1',
      item: 'Order 1',
      amount: 500,
      qty: 50,
      state: '5',
      zip: 5696
    };

    const dialogRefMock = {
      afterClosed: () => of(true),
    } as MatDialogRef<AddEditPopupComponent>;

    const openDialogSpy = spyOn(dialog, 'open').and.returnValue(dialogRefMock);
    const getTableDataSpy = spyOn(component, 'getTableData').and.callThrough();

    component.editOrder(mockOrder);

    expect(openDialogSpy).toHaveBeenCalledWith(AddEditPopupComponent, {
      data: { type: 'edit', data: mockOrder },
    });

    dialogRefMock.afterClosed().subscribe(() => {
      expect(getTableDataSpy).toHaveBeenCalled();
    });
  });

  it('should open add order dialog and refresh table data on closing', () => {
    const dialogRefMock = {
      afterClosed: () => of(true),
    } as MatDialogRef<AddEditPopupComponent>;
    const getTableDataSpy = spyOn(component, 'getTableData').and.callThrough();

    component.addOrder();

    dialogRefMock.afterClosed().subscribe(() => {
      expect(getTableDataSpy).toHaveBeenCalled();
    });
  });

  it('should delete an order and refresh table data', () => {
    const mockOrder: OrderInterface = {
      id: 1,
      name: 'Order 1',
      item: 'Order 1',
      amount: 500,
      qty: 50,
      state: '5',
      zip: 5696
    };

    const deleteOrderSpy = spyOn(apiData, 'deleteOrder').and.returnValue(of({ status: 200 }));
    const SwalFireSpy = spyOn(Swal, 'fire');

    const SwalFireQuestionSpy = spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }) as Promise<SweetAlertResult<any>>
    );

    const getTableDataSpy = spyOn(component, 'getTableData').and.callThrough();

    component.deleteOrder(mockOrder);

    expect(SwalFireQuestionSpy).toHaveBeenCalled();

    expect(deleteOrderSpy).toHaveBeenCalledWith('order/1');

    deleteOrderSpy.calls.mostRecent().returnValue.subscribe(() => {
      expect(SwalFireSpy).toHaveBeenCalledWith('Deleted!', 'Your Order has been deleted successfully.', 'success');
      expect(getTableDataSpy).toHaveBeenCalled();
    });
  });

  it('should handle error on deleting an order', () => {
    const mockOrder: OrderInterface = {
      id: 1,
      name: 'Order 1',
      item: 'Order 1',
      amount: 500,
      qty: 50,
      state: '5',
      zip: 5696
    };

    const errorMessage = 'Failed to delete order';

    const deleteOrderSpy = spyOn(apiData, 'deleteOrder').and.returnValue(
      throwError({ error: { message: errorMessage } })
    );

    const SwalFireSpy = spyOn(Swal, 'fire');

    const SwalFireQuestionSpy = spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }) as Promise<SweetAlertResult<any>>
    );

    const getTableDataSpy = spyOn(component, 'getTableData').and.callThrough();

    component.deleteOrder(mockOrder);

    expect(SwalFireQuestionSpy).toHaveBeenCalled();

    expect(deleteOrderSpy).toHaveBeenCalledWith('order/1');

    deleteOrderSpy.calls.mostRecent().returnValue.subscribe(() => {
      expect(SwalFireSpy).toHaveBeenCalledWith('Error!', errorMessage, 'error');
      expect(getTableDataSpy).toHaveBeenCalled();
    });
  });
});
