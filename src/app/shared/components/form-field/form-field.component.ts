import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css'
})
export class FormFieldComponent {
  
  @Input() label: string = '';
  @Input() placeholer: string = '';
  @Input() fieldType: string = "text";
  @Input() errorMessage: string = '';
  @Input() isOptional: boolean = false;
  @Input() hint: string = '';
  @Input() fieldControl!: FormControl;
  @Input() showPasswordToggle = false;

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
