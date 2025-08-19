import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedSurgicalPackagesComponent } from './fixed-surgical-packages.component';

describe('FixedSurgicalPackagesComponent', () => {
  let component: FixedSurgicalPackagesComponent;
  let fixture: ComponentFixture<FixedSurgicalPackagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FixedSurgicalPackagesComponent]
    });
    fixture = TestBed.createComponent(FixedSurgicalPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
