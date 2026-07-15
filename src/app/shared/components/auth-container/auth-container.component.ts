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

  @Input() backgroundColor = 'bg-background md:bg-white';
  @Input() contentClass = 'p-6 md:p-12';
  @Input() titleClass = 'text-start md:text-center';
  @Input() descriptionClass = 'md:text-center text-start';
  @Input() mobileDescriptionClass = 'text-start';
  @Input() hightClass = 'min-h-[90vh] md:min-h-auto pb-12';
  @Input() headerOutside = false; 
}


