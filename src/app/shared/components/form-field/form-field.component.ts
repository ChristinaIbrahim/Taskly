import { Component, Input } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { AppIconsDirective } from '../../directives/app-icons.directive';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [ReactiveFormsModule, AppIconsDirective],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() fieldType = 'text';
  @Input() errorMessage = '';
  @Input() isOptional = false;
  @Input() hint = '';
  @Input() fieldControl!: any;
  @Input() showPasswordToggle = false;

  isVisible = false;

  get inputType(): string {
    if (this.fieldType !== 'password') {
      return this.fieldType;
    }
    return this.isVisible ? 'text' : 'password';
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }
}
