import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DoctordetailsService } from '../doctordetails.service';
import { BlogDetailsDataService } from './blog-details-data.service';

@Component({
  selector: 'app-blog-details-data',
  templateUrl: './blog-details-data.component.html',
  styleUrls: ['./blog-details-data.component.css']
})
export class BlogDetailsDataComponent {
allCategories:any[]=[];
selectedCategory:any;
allCategoriesBlogs:any[] = [];

  constructor(
    private activated_routes: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private titleService: Title,
    private metaService: Meta,
    private blogsservice: BlogDetailsDataService
  ) { }

  ngOnInit(): void {
    this.activated_routes.queryParams.subscribe(params => {
      this.getBlogsDetails(params['blog_name']);
    });
    this.getBlogsData();
  }

  ngAfterViewChecked(): void {
    // if (!this.carouselInitialized && this.surgeryPackages.length) {
    //   this.carouselInitialized = true;
    //   setTimeout(() => this.initCarousel(), 100);
    // }
  }



  getBlogsDetails(blog_name:string): void {
    this.http.get<any>('assets/json_data_files/blogs.json').subscribe(data => {
      console.log(blog_name,data, 'data...');
      this.allCategories = data.categories || [];
      console.log(this.allCategories, 'allCategories...');
      
      let categoryNames: any = this.allCategories.flatMap(category => category.name);
      this.allCategoriesBlogs = [...new Set(categoryNames)].sort();
      console.log(this.allCategoriesBlogs, 'allCategoriesBlogs...');
      
      if (this.allCategories.length > 0) {
        this.selectedCategory = this.allCategories
      .flatMap(category => category.blogs)
      .find(blog => blog?.title === blog_name);
        console.log(this.selectedCategory, 'selectedCategory...');
        
      }
    });
  }

  selectCategory(categoryName: string): void {
    // this.selectedCategory = categoryName;
    const category = this.allCategories.find(c => c.name === categoryName);
    const blogs = category;
    console.log(blogs, 'blogs...');
    

    if (blogs.length > 0) {
    //   this.mainBlog = blogs[0];
    //   this.surgeryPackages = blogs.slice(1);
    //   this.selectedCategoryBlogs = [this.mainBlog];
    //   this.blog_title = this.mainBlog.blog_title;
    //   this.carouselInitialized = false;
    //   this.titleService.setTitle(this.mainBlog.metaTitle);
    //   this.metaService.updateTag({ name: 'description', content: this.mainBlog.metaDescription });
    // } else {
    //   this.selectedCategoryBlogs = [];
    //   this.surgeryPackages = [];
    }
  }

getBlogsData() {
  this.blogsservice.getPaginatedBlogs().subscribe((data: any) => {
    console.log(data,'data...');

  });
}

}
