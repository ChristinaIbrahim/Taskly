import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
export interface BreadcrumbItem {
  label: string;
  link?: string; 
}
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent {

  @Input() items: BreadcrumbItem[] = [];

}
