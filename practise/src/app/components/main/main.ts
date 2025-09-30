import { Component } from '@angular/core';
import { Tools } from '../../tools';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  imports: [FormsModule],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
  public allProducts:any; 
  public catergories:any;
  public activeCategory:number=0;
  public vegetarian:any=""
  public nuts:any=""
  public spiciness:string="-1"

  constructor( public tools:Tools){
    this.allCards(); 
    this.allCategories()

  }


  allCards(){
    this.activeCategory=0;
    this.tools.getAllProducts().subscribe((data:any)=>this.allProducts=data)
  }

  allCategories(){
    this.tools.getAllCategories().subscribe((data:any)=>this.catergories = data)
  }
  filterCategory(id:any){
    this.activeCategory=id;
    this.tools.filterCategory(id).subscribe((data:any)=>this.allProducts = data.products)

  }

  filterFoods(){
    let spc; 
    if(this.spiciness=="-1"){
      spc="";
    }else{
      spc=this.spiciness;
    }

    if(this.activeCategory !== 0){
      this.tools.filterAllFood(spc,this.nuts, this.vegetarian, this.activeCategory).subscribe((data:any)=>{
        console.log(data); 
        this.allProducts=data
      })
    }else{
      this.tools.filterAllFoodAllItems(spc,this.nuts, this.vegetarian).subscribe((data:any)=>{
        console.log(data); 
        this.allProducts=data;
      })
    }
 
  }

  reset(){
    this.nuts = ""; 
    this.vegetarian=""; 
    this.spiciness = "-1"; 
    this.allCards()
  }


addToCart(item:any){
  this.tools.allBaskets().subscribe((cartItems:any[])=>{
    const exsitingItem = cartItems.find(product=>product.product.id===item.id)

    if(exsitingItem){
      const updatedItem = {
        quantity:exsitingItem.quantity+1, 
        price:item.price,
        productId:item.id
      }
      
      this.tools.updateCart(updatedItem).subscribe(()=>{
        alert("განახლდა კალათაში პროდუქცის რაოდენობა")
      })

    }else{
      const cartInfo = {
        quantity:1, 
        price:item.price, 
        productId:item.id
      }
      this.tools.postCard(cartInfo).subscribe(()=>{
        alert("პროდუქტი დაემატა კალათაში")
      })
    }
  })
}

}
