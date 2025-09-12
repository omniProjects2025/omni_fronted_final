import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurEmpanelmentComponent } from './our-empanelment.component';

describe('OurEmpanelmentComponent', () => {
  let component: OurEmpanelmentComponent;
  let fixture: ComponentFixture<OurEmpanelmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurEmpanelmentComponent]
    });
    fixture = TestBed.createComponent(OurEmpanelmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
