import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkeltonComponent } from '../project/components/skelton/skelton.component';
import { ProjectMember } from '../project/project.model';
import { ProjectService } from '../project/project.service';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, SkeltonComponent],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {
  projectId: string | null = null;
  members: ProjectMember[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || 
                     this.route.parent?.snapshot.paramMap.get('id') || 
                     null;

    if (this.projectId) {
      this.fetchMembers(this.projectId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'Project ID not found in the URL.';
    }
  }

  fetchMembers(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.projectService.getProjectMembers(id).subscribe({
      next: (data) => {
        this.members = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching members:', err);
        this.errorMessage = 'Failed to load project members. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '??';
    
    const cleanName = name.includes('@') ? name.split('@')[0] : name;
    const parts = cleanName.trim().split(' ');
    
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0] ? parts[0][0].toUpperCase() : '??';
  }

  getRoleClass(role: string): string {
    switch (role?.toUpperCase()) {
      case 'OWNER': return 'bg-[#003D9B] text-white';
      case 'ADMIN': return 'bg-[#D2E3FF] text-[#003D9B]';
      case 'MEMBER': return 'bg-[#E2E8F0] text-[#475569]';
      case 'VIEWER': return 'bg-[#F1F5F9] text-[#64748B]';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}