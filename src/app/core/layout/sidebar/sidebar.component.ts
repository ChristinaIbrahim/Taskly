import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppIconsDirective } from '../../../shared/directives/app-icons.directive';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconsDirective],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isCollapsed = false;
  currentProjectId: string | null = null;
  private routerSubscription!: Subscription;

  ngOnInit(): void {
    this.extractProjectId();

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.extractProjectId();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

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

  private extractProjectId(): void {
    const urlSegments = this.router.url.split('/');
    if (
      urlSegments[1] === 'project' &&
      urlSegments[2] &&
      urlSegments[2] !== 'create'
    ) {
      this.currentProjectId = urlSegments[2];
    } else {
      this.currentProjectId = null;
    }
  }
}
