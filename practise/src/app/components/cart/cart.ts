import { Component } from '@angular/core';
import { Tools } from '../../tools';
import { Subscription } from 'rxjs';
import {FormsModule} from "@angular/forms"
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-cart',
  imports: [FormsModule,NgIf],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  public cartList:any[]=[]; 
  private cartSibscribtion:Subscription|undefined; 
  constructor (private service:Tools){
    this.loadCartItem()

  }

  loadCartItem(){
    this.cartList=[]; 
    this.cartSibscribtion = this.service.allBaskets().subscribe((data:any[])=>{
      this.cartList = data;
    })

  }

  updateBasket(item:any){
    const body={
      quantity:item.quantity, 
      price:item.product.price, 
      productId:item.product.id
    }; 
    item.totalPrice=item.product.price*item.quantity; 

    this.service.updateCart(body).subscribe({
      next:(res)=>{
        console.log("updated", res)
      }, 
      error:(err)=>{
        console.error("error", err)
      }
    })

  }

  removeItem(productId:number){
    this.service.removeFromCart(productId).subscribe({
      next:()=>{
        this.loadCartItem()
      }, 
      error:(err)=>{
        console.error("Error", err)
      }
    })
  }
  calculateTotalPrice():number{
    return this.cartList.reduce((total, item)=>total+item.product.price*item.quantity, 0)
  }

  }


