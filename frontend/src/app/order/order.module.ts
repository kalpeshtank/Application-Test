import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { AddEditPopupComponent } from './add-edit-popup/add-edit-popup.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModuleModule } from '../shared/material-module/material-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalSearchComponent } from './global-search/global-search.component';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent
  },
]
@NgModule({
  declarations: [OrderComponent, AddEditPopupComponent, GlobalSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MaterialModuleModule
  ],
  entryComponents: [AddEditPopupComponent]
})
export class OrderModule { }
