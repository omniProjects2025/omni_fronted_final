import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DoctorDetailsService } from '../services/doctor-details.service';
import { BlogDetailsService } from '../services/blog-details.service';

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
    private blogsservice: BlogDetailsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activated_routes.params.subscribe(params => {
      const slug = params['slug'];
      console.log('🔄 Received slug from URL:', slug);
      // Search by slug directly instead of converting to title
      this.getBlogsDetailsBySlug(slug);
    });
    this.getBlogsData();
  }

  ngAfterViewChecked(): void {
    // if (!this.carouselInitialized && this.surgeryPackages.length) {
    //   this.carouselInitialized = true;
    //   setTimeout(() => this.initCarousel(), 100);
    // }
  }



  getBlogsDetailsBySlug(slug: string): void {
    console.log('🔍 Searching for blog with slug:', slug);
    this.http.get<any>('assets/json_data_files/blogs.json').subscribe(data => {
      console.log('📊 Raw slug:', slug, 'All data:', data);
      this.allCategories = data.categories || [];
      console.log('📂 All categories:', this.allCategories);
      
      let categoryNames: any = this.allCategories.flatMap(category => category.name);
      this.allCategoriesBlogs = [...new Set(categoryNames)].sort();
      console.log(this.allCategoriesBlogs, 'allCategoriesBlogs...');
      
      if (this.allCategories.length > 0) {
        // Flatten all blogs from all categories
        const allBlogs = this.allCategories.flatMap(category => category.blogs || []);
        console.log('📝 All blogs count:', allBlogs.length);
        console.log('📝 First few blog slugs:', allBlogs.slice(0, 5).map(b => b.slug));
        
        // Search for exact slug match
        this.selectedCategory = allBlogs.find(blog => blog?.slug === slug);
        console.log('✅ Found selected category by slug:', this.selectedCategory);
        
        if (!this.selectedCategory) {
          console.log('❌ No slug match found, searching by generated slug from title...');
          // Fallback: generate slug from title and match
          this.selectedCategory = allBlogs.find(blog => {
            const generatedSlug = this.generateSlug(blog?.title || '');
            return generatedSlug === slug;
          });
          console.log('🔄 Found category by generated slug:', this.selectedCategory);
        }
        
        // Set meta tags if blog is found
        if (this.selectedCategory) {
          this.titleService.setTitle(this.selectedCategory.meta_title || this.selectedCategory.title);
          this.metaService.updateTag({ name: 'description', content: this.selectedCategory.meta_description || this.selectedCategory.blog_description });
        }
      }
    });
  }

  getBlogsDetails(blog_name: string): void {
    console.log('🔍 Searching for blog with title:', blog_name);
    this.http.get<any>('assets/json_data_files/blogs.json').subscribe(data => {
      console.log('📊 Raw blog name:', blog_name, 'All data:', data);
      this.allCategories = data.categories || [];
      console.log('📂 All categories:', this.allCategories);
      
      let categoryNames: any = this.allCategories.flatMap(category => category.name);
      this.allCategoriesBlogs = [...new Set(categoryNames)].sort();
      console.log(this.allCategoriesBlogs, 'allCategoriesBlogs...');
      
      if (this.allCategories.length > 0) {
        // Flatten all blogs from all categories
        const allBlogs = this.allCategories.flatMap(category => category.blogs || []);
        console.log('📝 All blogs count:', allBlogs.length);
        console.log('📝 First few blog titles:', allBlogs.slice(0, 5).map(b => b.title));
        
        // Search for exact title match
        this.selectedCategory = allBlogs.find(blog => blog?.title === blog_name);
        console.log('✅ Found selected category:', this.selectedCategory);
        
        // If no exact match, try case-insensitive search
        if (!this.selectedCategory) {
          console.log('❌ No exact match, trying case-insensitive search...');
          this.selectedCategory = allBlogs.find(blog => 
            blog?.title?.toLowerCase() === blog_name.toLowerCase()
          );
          console.log('🔄 Found category (case-insensitive):', this.selectedCategory);
        }
        
        // If still no match, trying partial match
        if (!this.selectedCategory) {
          console.log('❌ No case-insensitive match, trying partial search...');
          this.selectedCategory = allBlogs.find(blog => 
            blog?.title?.toLowerCase().includes(blog_name.toLowerCase())
          );
          console.log('🔄 Found category (partial match):', this.selectedCategory);
        }
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

  navigateToRelatedBlog(blog: any): void {
    const slug = blog.slug || this.generateSlug(blog.title);
    this.router.navigate(['/blogs', slug]);
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .trim(); // Remove leading/trailing spaces
  }

  convertSlugToTitle(slug: string): string {
    console.log('🔄 Converting slug to title:', slug);
    // Basic conversion: replace hyphens with spaces and capitalize
    const title = slug
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .replace(/-/g, ' ') // Replace hyphens with spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letters of words
    
    console.log('🔄 Converted title:', title);
    return title;
  }

getBlogsData() {
  this.blogsservice.getPaginatedBlogs().subscribe((data: any) => {
    console.log(data,'data...');

  });
}

}
