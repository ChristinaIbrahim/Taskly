import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AppIconsDirective } from '../../../shared/directives/app-icons.directive';

@Component({
  selector: 'app-accept-invitation',
  standalone: true,
  imports: [CommonModule , AppIconsDirective],
  templateUrl: './accept-invitation.component.html',
  styleUrl: './accept-invitation.component.css'
})
export class AcceptInvitationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  token: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  acceptInvitation() {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      const currentUrl = this.router.url;
      this.router.navigate(['/login'], { queryParams: { returnUrl: currentUrl } });
      return;
    }
    if (!this.token || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    const url = `${environment.supabaseUrl}/rest/v1/rpc/accept_invitation`;
    const headers = new HttpHeaders({
      'apikey': environment.supabase_api_key,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });

    const body = {
      p_token: this.token
    };

    this.http.post(url, body, { headers }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Invitation accepted successfully!';
        setTimeout(() => {
          this.router.navigate(['/']); 
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        const status = err.status;
        const serverMessage = err.error?.message || '';

        if (status === 401) {
          this.errorMessage = 'Unauthorized. Please log in again.';
        } else if (status === 403) {
          this.errorMessage = 'You do not have permission to accept this invitation.';
        } else if (serverMessage.toLowerCase().includes('expired')) {
          this.errorMessage = 'This invitation has expired.';
        } else if (serverMessage.toLowerCase().includes('invalid')) {
          this.errorMessage = 'Invalid invitation token.';
        } else {
          this.errorMessage = serverMessage || 'Invalid or expired invitation token.';
        }
      }
    });
  }
}