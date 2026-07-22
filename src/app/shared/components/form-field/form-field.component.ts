import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { AppIconsDirective } from '../../directives/app-icons.directive'; 
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,AppIconsDirective],
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
  @Input() fieldControl: FormControl = new FormControl('');
  @Input() showPasswordToggle = false;

  isVisible = false;

  get inputType(): string {
    if (this.fieldType !== 'password') {
      return this.fieldType;
    }
    return this.isVisible ? 'text' : 'password';
  }

  get fieldId(): string {
    if (!this.label) return 'field-input';
    return 'field-' + this.label.toLowerCase().trim().replace(/\s+/g, '-');
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }
}
