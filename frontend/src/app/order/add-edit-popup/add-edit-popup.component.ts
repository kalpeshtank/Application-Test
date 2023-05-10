import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-add-edit-popup',
  templateUrl: './add-edit-popup.component.html',
  styleUrls: ['./add-edit-popup.component.css']
})
export class AddEditPopupComponent implements OnInit {
  orderDataForm: FormGroup;
  id: string = '';
  modelData: any;
  loding: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
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
    this.modelData = data;
    if (data.data) {
      this.id = data.data.id;
      this.orderDataForm.patchValue({
        name: data.data.name, state: data.data.state, zip: data.data.zip,
        amount: data.data.amount, qty: data.data.qty, item: data.data.item,
      });
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.orderDataForm.controls;
  }
  ngOnInit() {
  }
  addRecord() {
    this.loding = true;
    this.apiData.create('order', this.orderDataForm.value).subscribe({
      next: (resonse: any) => {
        if (resonse.status == 200) {
          Swal.fire('Created!', resonse.message, 'success');
          this.dialogRef.close(true);
        }
        this.loding = false;
      },
      error: (err) => {
        const values = Object.values(err.error.data);
        const mergedString = values.join(', ');
        Swal.fire('Error!', mergedString, 'error');
        this.loding = false;
      }
    });
  }
  updateRecord() {
    this.loding = true;
    this.apiData.update('order/' + this.id, this.orderDataForm.value).subscribe({
      next: (resonse: any) => {
        if (resonse.status == 200) {
          Swal.fire('Updated!', resonse.message, 'success');
          this.dialogRef.close(true);
        }
        this.loding = false;
      },
      error: (err) => {
        const values = Object.values(err.error.data);
        const mergedString = values.join(', ');
        Swal.fire('Error!', mergedString, 'error');
        this.loding = false;
      }
    });
  }
}
