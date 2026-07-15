import { Component, Input , ChangeDetectionStrategy } from '@angular/core';
import { NavLogoComponent } from '../nav-logo/nav-logo.component';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [NgClass,NavLogoComponent],
  templateUrl: './auth-container.component.html',
  styleUrl: './auth-container.component.css'
})
export class AuthContainerComponent {

  @Input() title: string = '';
  @Input() description: string = '';
  @Input() mobileDescription = '';
  @Input() backgroundColor = 'bg-background';
  @Input() contentClass = 'p-6 md:p-12';
  @Input() titleClass = 'text-2xl md:text-3xl font-bold text-slate-900 text-center mb-1';
  @Input() descriptionClass = 'text-xl text-slate-500 text-center';
  @Input() mobileDescriptionClass = 'text-start';
  @Input() hightClass = 'min-h-[90vh] md:min-h-auto pb-12';
  @Input() headerOutside = false; 
}


