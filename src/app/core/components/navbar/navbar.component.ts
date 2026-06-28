import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  userName: string = '';
  userJob: string = 'Project Manager';
  userLetters: string = '';
  isDropdownOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getUserData().subscribe({
      next: (res: any) => {
        console.log('User data loaded:', res);
        const metadata = res.user_metadata;
        this.userName = res.user_metadata?.full_name || res.user_metadata?.display_name || 'User';
        this.generateAvatar(this.userName);
      },
      error: (err) => {
        console.error('Error fetching user data', err);
      }
    });
  }

  generateAvatar(name: string) {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      this.userLetters = (words[0][0] + words[1][0]).toUpperCase();

    } else {
      this.userLetters = name.substring(0, 2).toUpperCase();
    }

  }
  toggleDropDown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  logOut() {
    this.authService.logOut().subscribe({
      next: (res) => {
        console.log('Login Success');

        this.authService.clearData();

        this.isDropdownOpen = false;

        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Logout failed');
        console.error('Logout error:', err);
      }
    })
  }

}
