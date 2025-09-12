import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsMediaDetailsComponent } from './news-media-details.component';

describe('NewsMediaDetailsComponent', () => {
  let component: NewsMediaDetailsComponent;
  let fixture: ComponentFixture<NewsMediaDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsMediaDetailsComponent]
    });
    fixture = TestBed.createComponent(NewsMediaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
