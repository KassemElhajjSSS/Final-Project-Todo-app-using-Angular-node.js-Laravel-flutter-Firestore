import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/AuthServices/login/login.service';
import { User } from '../../../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  user?: User

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  

  // Getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      this.user = {
        name: username,
        password: password
      }
      this.loginService.login(this.user).subscribe({
        next: (response) => {
          if (response.status === 'ok') {
            localStorage.setItem('authToken', response.token);
            this.router.navigate(['/home']);
          } else {
            alert(response.message);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          alert('An error occurred while trying to log in.');
        }
      });
      // console.log('Username:', username);
      // console.log('Password:', password);
    } else {
      console.log('Form is not valid');
    }
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
