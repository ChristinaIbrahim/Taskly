import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppIconsDirective } from '../../directives/app-icons.directive';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppIconsDirective],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
})
export class FormFieldComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() fieldType: string = 'text';
  @Input() errorMessage: string = '';
  @Input() isOptional: boolean = false;
  @Input() hint: string = '';
  @Input() fieldControl!: any;
  @Input() showPasswordToggle: boolean = false;

  isVisible: boolean = false;

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
