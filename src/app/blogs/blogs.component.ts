import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CanonicalService } from '../services/canonical.service';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { VideoStateService } from '../services/video-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent {
  allBlogs: any[] = [];
  displayedBlogs: any[] = [];
  currentPage: number = 1;
  blogsPerPage: number = 12;
  totalPages: number = 0;
  allCategoriesBlogs: any[] = [];
  selectedCategory: any = '';
  filteredCategories: any[] = [];
  q = '';
  selected_btn = 1;
  private resizeListener: (() => void) | undefined;
  private videoSubscription: Subscription = new Subscription();
  private lastZoom: number = window.devicePixelRatio;
  private lastWindowWidth: number = window.innerWidth;


  public testimonials = [
    {
      name: "How Timely Treatment Saved a Life",
      profession: "",
      text: "Mrs. Krishnaveni suddenly experienced severe chest pain at her home and was immediately rushed to Omni Hospitals...",
      date: "Dec 8, 2025",
      videoPlayed: false,
      thumbnailUrl: 'YdgeAoLsLjQ',
      videoUrl: "https://www.youtube.com/embed/YdgeAoLsLjQ"
    },
    {
      name: "Affordable Maternity Package in Vizag",
      profession: "",
      text: "Affordable and Safe Delivery package for all expecting mothers.",
      date: "October 24, 2025",
      videoPlayed: false,
      thumbnailUrl: 'Z1jTd2v0P6s',
      videoUrl: "https://www.youtube.com/embed/Z1jTd2v0P6s"
    },
    {
      name: "Akash’s Recovery After Serious Cricket Injury",
      profession: "",
      text: "Akash met with an accident while playing cricket and suffered multiple fractures in his left arm.",
      date: "Aug 25, 2025",
      videoPlayed: false,
      thumbnailUrl: 'dCY4o43AI9M',
      videoUrl: "https://www.youtube.com/embed/dCY4o43AI9M"
    },
    {
      name: "Omni Hospitals, Kukatpally",
      profession: "",
      text: "Welcome to Omni Hospitals – where healing meets innovation, and every patient is treated with compassion, expertise and care.",
      date: "October 13, 2025",
      videoPlayed: false,
      thumbnailUrl: 'ab1njKIEnfQ',
      videoUrl: "https://www.youtube.com/embed/ab1njKIEnfQ"
    },
    {
      name: "Dr. Neelima",
      profession: "",
      text: "Dr. Neelima, leading Plastic & Reconstructive Surgeon at Omni Hospitals, Kukatpally",
      date: "October 4, 2025",
      videoPlayed: false,
      thumbnailUrl: '-n5xwQ_FT4s',
      videoUrl: "https://www.youtube.com/embed/-n5xwQ_FT4s"
    },
    {
      name: "Successful Knee Pain Surgery",
      profession: "",
      text: "In this testimonial, Koteshwar Rao shares his journey from living with constant knee pain to moving freely...",
      date: "Apr 15, 2025",
      videoPlayed: false,
      thumbnailUrl: 'dwNxv9xVl08',
      videoUrl: "https://www.youtube.com/embed/dwNxv9xVl08"
    },
    {
      name: "Prediabetes Explained by Dr. Seetha Katta",
      profession: "",
      text: "Prediabetes is an early warning stage where blood sugar levels are higher than normal but not yet in the diabetic range.",
      date: "Dec 16, 2025",
      videoPlayed: false,
      thumbnailUrl: 'KC9NknlG8Wk',
      videoUrl: "https://www.youtube.com/embed/KC9NknlG8Wk"
    },
    {
      name: "Safe and affordable knee replacement at Hyderabad",
      profession: "",
      text: "Total Knee Replacement Surgery is available at Omni Hospitals Kukatpally Hyderabad for Rs. 1.5 Lacs.",
      date: "Sep 26, 2025",
      videoPlayed: false,
      thumbnailUrl: 'yBb2HxdFGKY',
      videoUrl: "https://www.youtube.com/embed/yBb2HxdFGKY"
    }
  ]
  constructor(private router: Router, private http: HttpClient, private titleService: Title, private metaService: Meta, private canonicalService: CanonicalService, public sanitizer: DomSanitizer,
    private videoStateService: VideoStateService,
    private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.getBlogsDetails();
    this.setSEOTags();
    this.videoStateService.stopAllVideos();
    this.resizeListener = () => {
      this.handleResizeOrZoom();
    };
    window.addEventListener('resize', this.resizeListener);
    this.videoSubscription = this.videoStateService.currentlyPlayingVideo$.subscribe(videoId => {
      this.updateVideoStates(videoId);
    });
  }

  goToBlogDetails(blog_name: any) {
    const slug = this.generateSlug(blog_name);
    this.router.navigate(['/blogs', slug]);
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  getBlogsDetails(): void {
    this.http.get<any>('assets/json_data_files/main_blogs.json').subscribe((json_data) => {
      this.allBlogs = json_data.blogs;
      this.allBlogs.sort((a: any, b: any) => { return new Date(b.date).getTime() - new Date(a.date).getTime() });
      this.allBlogs.forEach((blog: any) => {
        if (!this.allCategoriesBlogs.includes(blog.category_name)) {
          this.allCategoriesBlogs.push(blog.category_name);
        }
      })
      this.totalPages = Math.ceil(this.allBlogs.length / this.blogsPerPage);
      this.updateDisplayedBlogs();
    })

  }
  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    this.videoSubscription.unsubscribe();
    this.videoStateService.stopAllVideos();
  }
  updateDisplayedBlogs(): void {
    let filtered = this.selectedCategory ? this.allBlogs.filter(blog => blog.category_name === this.selectedCategory) : this.allBlogs;
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
    console.log('this.selectedCategory', this.selectedCategory);
    this.currentPage = 1;
    this.updateDisplayedBlogs();
  }


  private setSEOTags(): void {
    this.titleService.setTitle('OMNI Hospitals Blog | Health News & Expert Medical Advice');
    this.metaService.updateTag({
      name: 'description',
      content: 'Read the OMNI Hospitals Blog for expert articles on health, wellness, and medical conditions. Get reliable advice from our top doctors and specialists.'
    });
    this.canonicalService.setCanonicalUrl('/');
  }


  playVideo(idx: number): void {
    const testimonial = this.testimonials[idx];
    if (!testimonial) return;
    this.videoStateService.stopAllVideos();
    const videoId = this.extractVideoId(testimonial.videoUrl);
    this.videoStateService.setCurrentlyPlayingVideo(videoId);
  }

  private extractVideoId(url: string): string {
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : url;
  }

  private updateVideoStates(currentVideoId: string | null): void {
    this.cdr.detectChanges();
  }

  isVideoPlaying(idx: number): boolean {
    const testimonial = this.testimonials[idx];
    if (!testimonial) return false;

    const videoId = this.extractVideoId(testimonial.videoUrl);
    return this.videoStateService.getCurrentlyPlayingVideo() === videoId;
  }

  private handleResizeOrZoom(): void {
    const currentZoom = window.devicePixelRatio;
    const currentWidth = window.innerWidth;
    if (Math.abs(currentZoom - this.lastZoom) > 0.1) {
      this.lastZoom = currentZoom;
    } else if (Math.abs(currentWidth - this.lastWindowWidth) > 50) {
      this.lastWindowWidth = currentWidth;
      this.videoStateService.stopAllVideos();
    }
  }

  onSelection(btn_type: number) {
    this.selected_btn = btn_type;
  }
}