import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologiesDetailsComponent } from './technologies-details.component';

describe('TechnologiesDetailsComponent', () => {
  let component: TechnologiesDetailsComponent;
  let fixture: ComponentFixture<TechnologiesDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnologiesDetailsComponent]
    });
    fixture = TestBed.createComponent(TechnologiesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
