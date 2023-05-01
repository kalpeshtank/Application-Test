import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-add-edit-popup',
  templateUrl: './add-edit-popup.component.html',
  styleUrls: ['./add-edit-popup.component.css']
})
export class AddEditPopupComponent implements OnInit {
  orderData: any = {};
  modelData: any;
  loding: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiData: ApiService) {
    this.modelData = data;
    if (data.data) {
      this.orderData = data.data;
    }
  }

  ngOnInit() {
  }
  addRecord() {
    this.loding = true;
    this.apiData.create('order', this.orderData).subscribe({
      next: (resonse: any) => {
        console.log(resonse);
        if (resonse.status == 200) {
        } else {
        }
        this.loding = false;
      },
      error: (err) => {
        console.error(err);
        this.loding = false;
      }
    });
  }
  updateRecord() {
    this.loding = true;
    let id = this.orderData.id;
    delete this.orderData.id;
    this.apiData.update('order/' + id, this.orderData).subscribe({
      next: (resonse: any) => {
        if (resonse.status == 200) {
        } else {
        }
        this.loding = false;
      },
      error: (err) => {
        console.error(err);
        this.loding = false;
      }
    });

  }
}
