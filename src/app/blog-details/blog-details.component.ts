import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent {
  carouselInitialized = false;
  surgeryPackages: any[] = [];
  allCategories: any[] = [];
  selectedCategoryBlogs: any[] = [];
  selectedCategory: string = '';
  mainBlog: any;
  blog_title: string = '';

  constructor(
    private activated_routes: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private titleService: Title,
    private metaService: Meta
  ) { }

  ngOnInit(): void {
    this.getBlogsDetails();
  }

  ngAfterViewChecked(): void {
    if (!this.carouselInitialized && this.surgeryPackages.length) {
      this.carouselInitialized = true;
      setTimeout(() => this.initCarousel(), 100);
    }
  }

  initCarousel() {
    if ($('.owl-carousel').length) {
      $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 1 },
          768: { items: 1 },
          992: { items: 2 },
          1200: { items: 2 }
        }
      });
    }
  }

  getBlogsDetails(): void {
    this.http.get<any>('assets/json_data_files/blogs.json').subscribe(data => {
      this.allCategories = data.categories || [];
      if (this.allCategories.length > 0) {
        this.selectCategory(this.allCategories[0].name);
      }
    });
  }

  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    const category = this.allCategories.find(c => c.name === categoryName);
    const blogs = category?.blogs || [];

    if (blogs.length > 0) {
      this.mainBlog = blogs[0];
      this.surgeryPackages = blogs.slice(1);
      this.selectedCategoryBlogs = [this.mainBlog];
      this.blog_title = this.mainBlog.blog_title;
      this.carouselInitialized = false;
      this.titleService.setTitle(this.mainBlog.metaTitle);
      this.metaService.updateTag({ name: 'description', content: this.mainBlog.metaDescription });
    } else {
      this.selectedCategoryBlogs = [];
      this.surgeryPackages = [];
    }
  }

  swapBlog(index: number): void {
    const temp = this.mainBlog;
    this.mainBlog = this.surgeryPackages[index];
    this.surgeryPackages[index] = temp;
    this.selectedCategoryBlogs = [this.mainBlog];
    this.blog_title = this.mainBlog.blog_title;
    this.carouselInitialized = false;
    this.titleService.setTitle(this.mainBlog.metaTitle);
    this.metaService.updateTag({ name: 'description', content: this.mainBlog.metaDescription });
  }
}
