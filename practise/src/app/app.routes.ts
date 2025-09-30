import { Routes } from '@angular/router';
import { Main } from './components/main/main';
import { Cart } from './components/cart/cart';
import { AuthPage } from './auth-page/auth-page';

export const routes: Routes = [
    {
        path:"", 
        component:Main
    }, 
    {
        path:"cart", 
        component:Cart
    }, 
    {
        path:"auth", 
        component:AuthPage
    }
];
