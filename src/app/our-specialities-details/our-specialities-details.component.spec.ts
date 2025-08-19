import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurSpecialitiesDetailsComponent } from './our-specialities-details.component';

describe('OurSpecialitiesDetailsComponent', () => {
  let component: OurSpecialitiesDetailsComponent;
  let fixture: ComponentFixture<OurSpecialitiesDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurSpecialitiesDetailsComponent]
    });
    fixture = TestBed.createComponent(OurSpecialitiesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
