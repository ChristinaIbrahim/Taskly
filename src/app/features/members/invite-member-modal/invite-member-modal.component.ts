import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberInviteService } from '../member-invite.service';
@Component({
  selector: 'app-invite-member-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invite-member-modal.component.html',
  styleUrl: './invite-member-modal.component.css'
})
export class InviteMemberModalComponent {

  @Input() projectId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() invited = new EventEmitter<void>();

  email: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  private inviteService = inject(MemberInviteService);

  onClose() {
    this.close.emit();
  }

  sendInvitation() {
    if (!this.email || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.inviteService.inviteMember(this.email, this.projectId).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Invitation sent successfully';
        setTimeout(() => {
          this.invited.emit();
          this.close.emit();
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to send invitation. Please try again.';
      }
    });
  }

}
