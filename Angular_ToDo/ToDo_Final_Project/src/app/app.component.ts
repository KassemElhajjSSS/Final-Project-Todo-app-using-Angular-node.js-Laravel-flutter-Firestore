import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'ToDo_Final_Project';
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    // Check if the user is logged in by looking for the token in localStorage
    this.isLoggedIn = !!localStorage.getItem('authToken');
  }

  onLoginSuccess(): void {
    // Set the login status to true when the login is successful
    this.isLoggedIn = true;
  }
}
