import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditPopupComponent } from './add-edit-popup/add-edit-popup.component';
import Swal from 'sweetalert2'
import { OrderInterface } from './order-interface';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  displayedColumns: any[] = [];
  tableRowData: OrderInterface[] = [];
  selection = new SelectionModel<OrderInterface>(true, []);
  tableObj = {
    dataSource: new MatTableDataSource<OrderInterface>([]),
    pageSizeOptions: [5, 10, 25, 50],
    pageSize: 10,
    pageIndex: 0,
    length: 0
  };
  loading: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private apiData: ApiService,
    public dialog: MatDialog) {
  }

  async ngOnInit() {
    await this.getTableData();// Fetches the table data
  }
  // Fetches the data for the table
  getTableData() {
    this.loading = true; // Indicates that data is being loaded
    // Calls the API service to get data
    this.apiData.getData('orders').subscribe({
      next: (resonse: any) => {
        if (resonse.status == 200) {

          let headers = resonse['data']['headers'];
          headers.push('Actions');
          this.displayedColumns = ['checkbox', ...headers];// Sets the displayed columns for the table
          this.tableRowData = resonse.data.data;
          this.tableObj.dataSource = new MatTableDataSource<OrderInterface>(this.tableRowData);// Sets the data source for the MatTable
          this.tableObj.length = this.tableRowData.length; // Sets the total length for pagination
          this.tableObj.dataSource.paginator = this.paginator; // Update the paginator reference
          this.tableObj.dataSource.sort = this.sort;// Assigns the MatSort directive to the data source
        } else {
          this.displayedColumns = [];
          this.tableObj.dataSource = new MatTableDataSource<OrderInterface>([]);// Sets an empty data source
          this.tableObj.length = 0;
        }
        this.loading = false;// Data loading is complete
      },
      error: (err) => {
        this.tableObj.dataSource = new MatTableDataSource<OrderInterface>([]);// Sets an empty data source
        this.tableObj.length = 0;
        this.loading = false;// Data loading is complete
        let mergedString = "";
        if (err.error.data) {
          const values = Object.values(err.error.data);
          mergedString = values.join(', ');
        } else {
          mergedString = err.error.message;
        }
        Swal.fire('Error!', mergedString, 'error');
      }
    });
  }
  // filter data from table
  searchData(eventData: string) {
    // Filter the data based on search query
    this.tableObj.dataSource.filter = eventData.trim().toLowerCase();
  }

  // Opens the edit order dialog
  editOrder(row: any) {
    const dialogRef = this.dialog.open(AddEditPopupComponent, {
      data: { type: 'edit', data: row },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTableData();// Refreshes the table data if changes were made
      }
    });
  }
  // Opens the add order dialog
  addOrder() {
    const dialogRef = this.dialog.open(AddEditPopupComponent, {
      data: { type: 'add' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTableData();// Refreshes the table data if changes were made
      }
    });
  }
  // Deletes an order
  deleteOrder(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this item? You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Calls the API service to delete the order
        this.apiData.delete('order/' + row.id).subscribe({
          next: (resonse: any) => {
            if (resonse.status == 200) {
              Swal.fire('Deleted!', 'Your Order has been deleted successfully.', 'success');
              this.getTableData();// Refreshes the table data after deleting the order
            }
          },
          error: (err) => {
            let mergedString = "";
            if (err.error.data) {
              const values = Object.values(err.error.data);
              mergedString = values.join(', ');
            } else {
              mergedString = err.error.message;
            }
            Swal.fire('Error!', mergedString, 'error');
          }
        });
      }
    })
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableObj.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableObj.dataSource.data.forEach(row => this.selection.select(row));
  }
  // Method to delete selected orders
  deleteSelectedOrders() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete the selected orders? You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete them!'
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedIds = this.selection.selected.map(order => order.id);
        // Calls the API service to delete the selected orders
        this.apiData.delete('orders', selectedIds).subscribe({
          next: (resonse: any) => {
            if (resonse.status == 200) {
              Swal.fire('Deleted!', 'Selected orders have been deleted successfully.', 'success');
              this.getTableData();// Refreshes the table data after deleting the orders
              this.selection.clear();// Clear the selected orders array
            }
          },
          error: (err) => {
            let mergedString = "";
            if (err.error.data) {
              const values = Object.values(err.error.data);
              mergedString = values.join(', ');
            } else {
              mergedString = err.error.message;
            }
            Swal.fire('Error!', mergedString, 'error');
          }
        });
      }
    })
  }
  // Handles the page change event
  onPageChange(event: any) {
    this.tableObj.pageIndex = event.pageIndex;
    this.tableObj.pageSize = event.pageSize;
  }
}

