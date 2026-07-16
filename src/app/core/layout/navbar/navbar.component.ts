// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface SupabaseUser {
  id: string;
  user_metadata: {
    full_name?: string;
    name?: string;
    job_title?: string;
    department?: string;
  };
  email?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any = null;
  avatarInitials: string = '';

  private baseUrl = 'https://your-supabase-project.supabase.co'; 
  private apiKey = 'YOUR_SUPABASE_ANON_KEY'; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData() {
    const headers = new HttpHeaders({
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`, // Supabase بتحتاج الـ Token هنا كمان
      'Content-Type': 'application/json'
    });

    this.http.get<SupabaseUser>(`${this.baseUrl}/auth/v1/user`, { headers }).subscribe({
      next: (res) => {
        // بنخزن البيانات اللي راجعة من السوبابيز
        const fullName = res.user_metadata?.full_name || res.user_metadata?.name || 'User';
        const jobTitle = res.user_metadata?.job_title || 'Project Manager'; // أو القيمة الافتراضية

        this.user = {
          name: fullName,
          job_title: jobTitle
        };

        // تشغيل ميثود استخراج أول حرفين
        this.avatarInitials = this.getAvatarInitials(fullName);
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
        // قيم افتراضية في حالة الفشل لتجنب كسر الشاشة
        this.user = { name: 'Guest User', job_title: 'Team Member' };
        this.avatarInitials = 'GU';
      }
    });
  }

  getAvatarInitials(name: string): string {
    if (!name) return 'US';
    
    const parts = name.trim().split(/\s+/); 
    
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
      return name.slice(0, 2).toUpperCase();
    }
  }
}