import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurSpecialitiesComponent } from './our-specialities.component';

describe('OurSpecialitiesComponent', () => {
  let component: OurSpecialitiesComponent;
  let fixture: ComponentFixture<OurSpecialitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurSpecialitiesComponent]
    });
    fixture = TestBed.createComponent(OurSpecialitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
