import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedSurgeryDetailsComponent } from './fixed-surgery-details.component';

describe('FixedSurgeryDetailsComponent', () => {
  let component: FixedSurgeryDetailsComponent;
  let fixture: ComponentFixture<FixedSurgeryDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FixedSurgeryDetailsComponent]
    });
    fixture = TestBed.createComponent(FixedSurgeryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
