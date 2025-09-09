import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

import {
  RxFormBuilder, // <-- from rxweb
} from '@rxweb/reactive-form-validators';
import { RegisterInterface } from '../models/register.model';
import { RegisterRequest } from '../models/registerRequest';



@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  isLoading = false;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  constructor(
    private rxFormBuilder: RxFormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    const model = new RegisterInterface();
    this.registerForm = this.rxFormBuilder.formGroup(model);
  }

  ngOnDestroy(): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const value = this.registerForm.value as RegisterInterface ;


    const payload: RegisterRequest = {
      email: value.email,
      password: value.password,
      confirmPassword: value.confirmPassword, 
      firstName: value.firstName,
      lastName: value.lastName,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.showToastMessage('Registration successful! Welcome to our platform.', 'success');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        const errorMsg = err?.error?.message || err?.message || 'Registration failed. Please try again.';
        this.showToastMessage(errorMsg, 'error');
      },
    });
  }

  private showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    const duration = type === 'success' ? 5000 : 8000;
    this.toastTimeout = setTimeout(() => this.hideToast(), duration);
  }

  hideToast(): void {
    this.showToast = false;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  hasError(controlName: string, errorKey?: string): boolean {
    const c = this.registerForm.get(controlName);
    if (!c) return false;
    if (errorKey) return !!c.errors?.[errorKey] && (c.dirty || c.touched);
    return !!c.errors && (c.dirty || c.touched);
  }

  firstError(controlName: string): string | null {
    const c = this.registerForm.get(controlName);
    if (!c || !c.errors) return null;
    const firstKey = Object.keys(c.errors)[0];
    const err = c.errors[firstKey];
    return typeof err === 'string' ? err : err?.message || firstKey;
  }
}
