import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/AuthServices/signup/signup.service';
import { User } from '../../../types';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  user?: User

  constructor(private fb: FormBuilder, private signupService: SignupService, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Email field with validation
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.user = {
        name: this.signupForm.value.username,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      };
      
      this.signupService.signup(this.user).subscribe({
        next: (response) => {
          if (response.status === 'ok') {
            localStorage.setItem('authToken', response.token); // Store the token in localStorage
            this.router.navigate(['/home']); 
          } else {
            alert(response.message);
          }
        },
        error: (error) => {
          console.error('Signup failed:', error);
          alert('An error occurred during signup.');
        }
      });
    } else {
      console.log('Form is not valid');
    }
  }

  navigateToLogin(): void{
    this.router.navigate(['/login'])
  }
}
