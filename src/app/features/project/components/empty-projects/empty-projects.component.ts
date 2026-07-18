import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-projects',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './empty-projects.component.html',
  styleUrl: './empty-projects.component.css'
})
export class EmptyProjectsComponent {

}
