import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorProjectComponent } from './error-project.component';

describe('ErrorProjectComponent', () => {
  let component: ErrorProjectComponent;
  let fixture: ComponentFixture<ErrorProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorProjectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
