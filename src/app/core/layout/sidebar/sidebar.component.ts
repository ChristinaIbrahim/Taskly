import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppIconsDirective } from '../../../shared/directives/app-icons.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconsDirective],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  isCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logOut().subscribe({
      next: () => {
        this.authService.clearData();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.clearData();
        this.router.navigate(['/login']);
      },
    });
  }
}
