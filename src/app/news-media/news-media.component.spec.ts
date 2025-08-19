import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsMediaComponent } from './news-media.component';

describe('NewsMediaComponent', () => {
  let component: NewsMediaComponent;
  let fixture: ComponentFixture<NewsMediaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsMediaComponent]
    });
    fixture = TestBed.createComponent(NewsMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
