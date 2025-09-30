import { Component } from '@angular/core';
import { Signin } from '../signin/signin';
import { Signup } from '../signup/signup';

@Component({
  selector: 'app-auth-page',
  imports: [Signin, Signup],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css'
})
export class AuthPage {

}
