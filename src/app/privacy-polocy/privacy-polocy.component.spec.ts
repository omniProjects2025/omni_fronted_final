import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolocyComponent } from './privacy-polocy.component';

describe('PrivacyPolocyComponent', () => {
  let component: PrivacyPolocyComponent;
  let fixture: ComponentFixture<PrivacyPolocyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacyPolocyComponent]
    });
    fixture = TestBed.createComponent(PrivacyPolocyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
