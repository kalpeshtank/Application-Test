import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { OrderInterface } from '../order-interface';
@Component({
  selector: 'app-add-edit-popup',
  templateUrl: './add-edit-popup.component.html',
  styleUrls: ['./add-edit-popup.component.css']
})
export class AddEditPopupComponent implements OnInit {
  orderDataForm: FormGroup; // Form group for the order_data
  id: string = ''; // ID of the order
  modelData: OrderInterface; // Data passed to the dialog component
  title: string = "Create order"; // Title of the dialog
  loading: boolean = false; // Indicates if order_data is being loaded
  constructor(
    @Inject(MAT_DIALOG_DATA) public orderItem: any,
    private apiData: ApiService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEditPopupComponent>
  ) {
    // Initialize the form using the form builder
    this.orderDataForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      state: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      zip: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5), Validators.pattern('^[0-9]+$')]],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      qty: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      item: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]]
    });
    this.modelData = orderItem;
    this.title = this.modelData.type == 'edit' ? 'Edit order' : 'Create order';
    if (orderItem.data) {
      this.id = orderItem.data.id;
      this.orderDataForm.patchValue({
        name: orderItem.data.name, state: orderItem.data.state, zip: orderItem.data.zip,
        amount: orderItem.data.amount, qty: orderItem.data.qty, item: orderItem.data.item,
      });
    }
  }
  // Getter to access form controls easily
  get f(): { [key: string]: AbstractControl } {
    return this.orderDataForm.controls;
  }
  ngOnInit() {
  }
  // Add a new order record
  addRecord() {
    this.loading = true;
    this.apiData.createOrder('order', this.orderDataForm.value).subscribe({
      next: (resonse: any) => {
        if (resonse.status == 200) {
          Swal.fire('Created!', resonse.message, 'success');
          this.dialogRef.close(true);
        }
        this.loading = false;
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
        this.loading = false;
      }
    });
  }
  // Update an existing order record
  updateRecord() {
    this.loading = true;
    this.apiData.updateOrder('order/' + this.id, this.orderDataForm.value).subscribe({
      next: (resonse: any) => {
        if (resonse.status == 200) {
          Swal.fire('Updated!', resonse.message, 'success');
          this.dialogRef.close(true);
        }
        this.loading = false;
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
        this.loading = false;
      }
    });
  }
}
