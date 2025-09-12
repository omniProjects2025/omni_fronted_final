import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondOpinionComponent } from './second-opinion.component';

describe('SecondOpinionComponent', () => {
  let component: SecondOpinionComponent;
  let fixture: ComponentFixture<SecondOpinionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecondOpinionComponent]
    });
    fixture = TestBed.createComponent(SecondOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
