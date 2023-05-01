import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddEditPopupComponent } from './add-edit-popup/add-edit-popup.component';

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
    private _snackBar: MatSnackBar,
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
          this.displayedColumns = [...resonse.data.heders, 'actions'];
          this.tableObj.dataSource = new MatTableDataSource(resonse.data.data);
        } else {
          this.displayedColumns = [];
          this.tableObj.dataSource = new MatTableDataSource([]);
        }
        this.loding = false;
      },
      error: (err) => {
        console.error(err);
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
    if (confirm("Are you sure you want to delete this item?")) {
      this.apiData.delete('order/' + row.id).subscribe({
        next: (resonse: any) => {
          if (resonse.status == 200) {
            this._snackBar.open("Order delete success successfully", 'ok', {
              horizontalPosition: 'end', verticalPosition: 'top',
              panelClass: ['snackbar-success'],
              // duration: 5000
            });
          }
        },
        error: (err) => {
          this._snackBar.open(err.statusText, 'ok', {
            horizontalPosition: 'end', verticalPosition: 'top',
            panelClass: ['snackbar-error'],
            // duration: 5000
          });
        }
      });
    }

  }

}
