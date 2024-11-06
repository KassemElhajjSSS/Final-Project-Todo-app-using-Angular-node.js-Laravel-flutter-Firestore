import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // User is logged in, so redirect to the home page
      this.router.navigate(['/home']);
      return false;
    }

    // User is not logged in, allow access to the login page
    return true;
  }
}
