import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppIconsDirective } from '../../directives/app-icons.directive'; // 👈 تأكدي من صحة هذا المسار للـ Directive عندكِ

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // 👈 ضروري جداً لإنهاء خطأ [formControl]
    AppIconsDirective    // 👈 ضروري جداً لتشغيل أيقونات العين
  ],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css'
})
export class FormFieldComponent {
  @Input() label: string = '';
  @Input() placeholder: string = ''; // 👈 تم كتابتها بالتهجئة الصحيحة
  @Input() fieldType: string = 'text';
  @Input() errorMessage: string = '';
  @Input() isOptional: boolean = false;
  @Input() hint: string = '';
  @Input() fieldControl!: any; // 👈 جعلناها any لتجنب أي أخطاء من المترجم
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