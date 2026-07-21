import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  user: { name: string; job_title: string } | null = null;
  avatarInitials = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe({
      next: (response: any) => {
        if (response && response.user_metadata) {
          this.user = {
            name: response.user_metadata.full_name || 'User',
            job_title: response.user_metadata.job_title || 'Team Member',
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

  getInitials(name: string): string {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}
