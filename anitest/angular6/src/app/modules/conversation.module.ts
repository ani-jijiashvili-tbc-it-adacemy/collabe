import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyComponent } from '../components/currency/currency.component';


const routes: Routes = [
  {
    path: '',
    component: CurrencyComponent
  }
];

@NgModule({
  declarations: [
    CurrencyComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ConversionModule { }