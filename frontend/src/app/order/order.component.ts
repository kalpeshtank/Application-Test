import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditPopupComponent } from './add-edit-popup/add-edit-popup.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  displayedColumns: any[] = [];
  tableObj = {
    dataSource: new MatTableDataSource([]),
  };
  loding: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private apiData: ApiService,
    public dialog: MatDialog) { }

  async ngOnInit() {
    await this.getTableData();
    this.tableObj.dataSource.sort = this.sort;
  }
  getTableData() {
    this.loding = true;
    this.apiData.getData('orders').subscribe({
      next: (resonse: any) => {
        if (resonse.status == 200) {
          let headers = resonse['data']['headers'];
          headers.push('Actions');
          this.displayedColumns = headers;
          this.tableObj.dataSource = new MatTableDataSource(resonse.data.data);
        } else {
          this.displayedColumns = [];
          this.tableObj.dataSource = new MatTableDataSource([]);
        }
        this.loding = false;
      },
      error: (err) => {
        this.tableObj.dataSource = new MatTableDataSource([]);
        this.loding = false;
      }
    });
  }
  editOrder(row: any) {
    const dialogRef = this.dialog.open(AddEditPopupComponent, {
      data: { type: 'edit', data: row },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTableData();
      }
    });
  }
  addOrder() {
    const dialogRef = this.dialog.open(AddEditPopupComponent, {
      data: { type: 'add' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTableData();
      }
    });
  }
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
        this.apiData.delete('order/' + row.id).subscribe({
          next: (resonse: any) => {
            if (resonse.status == 200) {
              Swal.fire('Deleted!', 'Your Order has been deleted successfully.', 'success');
              this.getTableData();
            }
          },
          error: (err) => {
            Swal.fire('Error!', err.statusText, 'error')
          }
        });
      }
    })
  }

}
