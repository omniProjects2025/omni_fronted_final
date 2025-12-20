import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientTestimonialsComponent } from './patient-testimonials.component';

describe('PatientTestimonialsComponent', () => {
  let component: PatientTestimonialsComponent;
  let fixture: ComponentFixture<PatientTestimonialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientTestimonialsComponent]
    });
    fixture = TestBed.createComponent(PatientTestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
