import { Component } from '@angular/core';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
@Component({
  selector: 'app-project',
  standalone: true,
  imports: [NavbarComponent,SidebarComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {

}
