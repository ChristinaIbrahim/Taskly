import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { AppIconsDirective } from '../../../directives/app-icons.directive';
import { MobileMenuService } from '../../../services/mobile-menu.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AppIconsDirective],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  readonly mobileMenu = inject(MobileMenuService);

  user: { name: string; job_title: string } | null = null;
  avatarInitials = '';

  ngOnInit(): void {
    this.authService.user$.subscribe({
      next: (response: Record<string, unknown> | null) => {
        if (response && response['user_metadata']) {
          const metadata = response['user_metadata'] as Record<string, string>;
          this.user = {
            name: metadata['full_name'] || 'User',
            job_title: metadata['job_title'] || 'Team Member',
          };
          this.avatarInitials = this.getInitials(this.user.name);
        } else {
          this.user = null;
          this.avatarInitials = '';
        }
      },
      error: (err) => {
        console.error('Failed to update navbar data:', err);
      },
    });

    this.authService.getUserData().subscribe();
  }

  toggleMobileMenu(): void {
    this.mobileMenu.toggle();
  }

  getInitials(name: string): string {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}