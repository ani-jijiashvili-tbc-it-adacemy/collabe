import { Component, signal } from '@angular/core';
import { LoginContainerComponent } from './features/auth/containers/login/login.container';


@Component({
  selector: 'app-root',
  imports: [LoginContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

}
