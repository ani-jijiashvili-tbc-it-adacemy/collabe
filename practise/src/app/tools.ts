import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Tools {
  constructor( public http:HttpClient){}


  getAllProducts(){
  return this.http.get("https://restaurant.stepprojects.ge/api/Products/GetAll")
  }

  getAllCategories(){
    return this.http.get("https://restaurant.stepprojects.ge/api/Categories/GetAll")
  }
  filterCategory(id:any){
    return this.http.get(`https://restaurant.stepprojects.ge/api/Categories/GetCategory/${id}`)
  }
    filterAllFood(spiciness:any, nuts:any, vegetarian:any,GetCategoryId:any){
    return this.http.get(`https://restaurant.stepprojects.ge/api/Products/GetFiltered?vegeterian=${vegetarian}&nuts=${nuts}&spiciness=${spiciness}&categoryId=${GetCategoryId}`)
  }

  filterAllFoodAllItems(spiciness:any, nuts:any, vegetarian:any){
    return this.http.get(`https://restaurant.stepprojects.ge/api/Products/GetFiltered?vegeterian=${vegetarian}&nuts=${nuts}&spiciness=${spiciness}`)
  }

  postCard(cardInfo:any){
    return this.http.post("https://restaurant.stepprojects.ge/api/Baskets/AddToBasket", cardInfo)
  }
  allBaskets():Observable<any>{
    return this.http.get<any[]>("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
  }
  updateCart(body:{quantity:number, price:number, productId:number}){
    return this.http.put(`https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket`, body)

  }
  removeFromCart(productId:number){
    return this.http.delete(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${productId}`)
  }
  
  signup(info:any){
    return this.http.post("https://api.everrest.educata.dev/auth/sign_up", info)
  }
  signin(info:any){
    return this.http.post("https://api.everrest.educata.dev/auth/sign_in", info)
  }



}
