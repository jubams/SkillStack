import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/interfaces/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: User | null = null;
  private authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
        if (isAuthenticated) {
          this.currentUser = this.authService.getUser();
        } else {
          this.currentUser = null;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return '';
  }

  getUserProfileImage(): string {
    return this.currentUser?.profileImage || '/assets/images/default-avatar.svg';
  }
  
  logout(): void {
    this.authService.logout();
  }
}
