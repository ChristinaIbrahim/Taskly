import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [],
  templateUrl: './auth-container.component.html',
  styleUrl: './auth-container.component.css'
})
export class AuthContainerComponent {

  @Input() title: string = '';
  @Input() description: string = '';

}
