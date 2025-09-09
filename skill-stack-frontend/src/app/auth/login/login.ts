import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { AuthService } from '../auth.service';
import { LoginInterface } from '../models/login.model';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  loginModel: LoginInterface;
  
  // Toast notification properties
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  constructor(
    private formBuilder: RxFormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginModel = new LoginInterface();
    this.loginForm = this.formBuilder.formGroup(this.loginModel);
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const credentials: LoginInterface = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showToastMessage('Login successful! Welcome back.', 'success');
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500); 
        },
        error: (error) => {
          this.isLoading = false;
          const errorMsg = error.message || 'Login failed. Please try again.';
          this.showToastMessage(errorMsg, 'error');
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // Clear existing timeout
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    // Auto hide after specified duration
    const duration = type === 'success' ? 5000 : 8000;
    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, duration);
  }

  hideToast(): void {
    this.showToast = false;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }


}