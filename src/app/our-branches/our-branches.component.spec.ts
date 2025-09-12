import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurBranchesComponent } from './our-branches.component';

describe('OurBranchesComponent', () => {
  let component: OurBranchesComponent;
  let fixture: ComponentFixture<OurBranchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurBranchesComponent]
    });
    fixture = TestBed.createComponent(OurBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
