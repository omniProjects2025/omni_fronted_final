import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDetailsDataComponent } from './blog-details-data.component';

describe('BlogDetailsDataComponent', () => {
  let component: BlogDetailsDataComponent;
  let fixture: ComponentFixture<BlogDetailsDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogDetailsDataComponent]
    });
    fixture = TestBed.createComponent(BlogDetailsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
