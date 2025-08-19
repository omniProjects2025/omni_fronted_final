import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent {
  allBlogs: any[] = [];
  displayedBlogs:any[]=[];
  currentPage: number = 1;
  blogsPerPage: number = 12;
  totalPages: number = 0;
  allCategoriesBlogs: any[] = [];
  selectedCategory: any = '';
  filteredCategories: any[] = [];
  q = '';

  constructor(private router: Router, private http: HttpClient,) {}
  ngOnInit(): void {
    this.getBlogsDetails();
  }

  goToBlogDetails(blog_name: any) {
    this.router.navigate(['/blogs-details-data'], {
      queryParams: {
        blog_name: blog_name
      }
    });
  }
  getBlogsDetails(): void {
    this.http.get<any>('assets/json_data_files/main_blogs.json').subscribe((json_data)=>{
      this.allBlogs = json_data.blogs;
      this.allBlogs.sort((a:any,b:any)=>{ return new Date(b.date).getTime() - new Date(a.date).getTime()});
    this.allBlogs.forEach((blog: any) => {
      if (!this.allCategoriesBlogs.includes(blog.category_name)) {
        this.allCategoriesBlogs.push(blog.category_name);
      }
    })
    this.totalPages = Math.ceil(this.allBlogs.length / this.blogsPerPage);
    this.updateDisplayedBlogs();
    })
    
  }

  updateDisplayedBlogs(): void {
    let filtered = this.selectedCategory ? this.allBlogs.filter(blog=> blog.category_name === this.selectedCategory) : this.allBlogs;
  this.totalPages = Math.ceil(filtered.length / this.blogsPerPage);
  const start = (this.currentPage - 1) * this.blogsPerPage;
  this.displayedBlogs = filtered.slice(start, start + this.blogsPerPage);
  }

  goToPage(page: number): void {
     if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.updateDisplayedBlogs();
  }

  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    console.log('this.selectedCategory',this.selectedCategory);
    this.currentPage = 1;
    this.updateDisplayedBlogs();
  }

}
