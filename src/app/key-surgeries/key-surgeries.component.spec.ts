import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeySurgeriesComponent } from './key-surgeries.component';

describe('KeySurgeriesComponent', () => {
  let component: KeySurgeriesComponent;
  let fixture: ComponentFixture<KeySurgeriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeySurgeriesComponent]
    });
    fixture = TestBed.createComponent(KeySurgeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
