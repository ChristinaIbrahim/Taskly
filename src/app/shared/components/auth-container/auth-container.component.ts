import { Component, Input } from '@angular/core';
import { NavLogoComponent } from '../nav-logo/nav-logo.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [NgClass, NavLogoComponent],
  templateUrl: './auth-container.component.html',
  styleUrl: './auth-container.component.css',
})
export class AuthContainerComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() mobileDescription = '';
  @Input() backgroundColor = 'bg-background';
 
}
