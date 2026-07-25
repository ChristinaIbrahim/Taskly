import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    const hash = window.location.hash;

    if (
      hash &&
      hash.includes('access_token=') &&
      hash.includes('type=recovery')
    ) {
      this.router.navigateByUrl(`/reset-password${hash}`);
    }
  }
}
