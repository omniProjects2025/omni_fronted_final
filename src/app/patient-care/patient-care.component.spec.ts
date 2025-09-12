import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCareComponent } from './patient-care.component';

describe('PatientCareComponent', () => {
  let component: PatientCareComponent;
  let fixture: ComponentFixture<PatientCareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientCareComponent]
    });
    fixture = TestBed.createComponent(PatientCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
