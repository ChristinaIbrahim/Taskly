import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardProjectComponent } from '../../components/card-project/card-project.component'; 
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink, CardProjectComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent {

}
