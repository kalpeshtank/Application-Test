import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditPopupComponent } from './add-edit-popup/add-edit-popup.component';
import Swal from 'sweetalert2'
import { OrderInterface } from './order-interface';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  displayedColumns: any[] = [];
  tableObj = {
    dataSource: new MatTableDataSource<OrderInterface>([]),
  };
  loading: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private apiData: ApiService,
    public dialog: MatDialog) { }

  async ngOnInit() {
    await this.getTableData();// Fetches the table data
    this.tableObj.dataSource.sort = this.sort;// Assigns the MatSort directive to the data source
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
          this.displayedColumns = headers;// Sets the displayed columns for the table
          this.tableObj.dataSource = new MatTableDataSource<OrderInterface>(resonse.data.data);// Sets the data source for the MatTable
        } else {
          this.displayedColumns = [];
          this.tableObj.dataSource = new MatTableDataSource<OrderInterface>([]);// Sets an empty data source
        }
        this.loading = false;// Data loading is complete
      },
      error: (err) => {
        this.tableObj.dataSource = new MatTableDataSource<OrderInterface>([]);// Sets an empty data source
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
}

