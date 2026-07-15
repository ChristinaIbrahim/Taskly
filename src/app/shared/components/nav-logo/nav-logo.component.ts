import { Component } from '@angular/core';
import { AppIconsDirective } from '../../directives/app-icons.directive';

@Component({
  selector: 'app-nav-logo',
  standalone: true,
  imports: [AppIconsDirective],
  templateUrl: './nav-logo.component.html',
  styleUrl: './nav-logo.component.css'
})
export class NavLogoComponent {

}
