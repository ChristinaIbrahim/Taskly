import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeltonComponent } from './skelton.component';

describe('SkeltonComponent', () => {
  let component: SkeltonComponent;
  let fixture: ComponentFixture<SkeltonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeltonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkeltonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
