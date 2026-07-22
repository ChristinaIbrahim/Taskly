import { Component, OnInit, HostListener } from '@angular/core';

import { NavbarComponent } from './navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  ngOnInit(): void {
    history.pushState(null, '', location.href);
  }

  @HostListener('window:popstate')
  onPopState(): void {
    history.pushState(null, '', location.href);
  }
}