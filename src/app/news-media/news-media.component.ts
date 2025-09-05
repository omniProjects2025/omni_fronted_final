// Imports and component definition below (keep only one set)
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../services/news.service';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { VideoStateService } from '../services/video-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news-media',
  templateUrl: './news-media.component.html',
  styleUrls: ['./news-media.component.css']
})
export class NewsMediaComponent implements OnInit, OnDestroy {
  private resizeListener: (() => void) | undefined;
  private videoSubscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    this.videoSubscription.unsubscribe();
    this.videoStateService.stopAllVideos();
  }
  media_type = 1;
  allNews: any[] = [];
  
  public testimonials = [
    // <iframe width="560" height="315" src="https://www.youtube.com/embed/cU69sod1Cxw?si=BUSiADVxNlWPhtVW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
     {
      name: "",
      profession: "",
      text: "Omni Hospitals, Kukatpally | Trusted Multispeciality Hospital for Every Generation",
      date: "Jun 13, 2025",
      videoPlayed: false,
      thumbnailUrl: 'ab1njKIEnfQ',
      videoUrl: "https://www.youtube.com/embed/ab1njKIEnfQ"
    },
{
      name: "Mr. Diva Prasad ",
      profession: "",
      text: "From Near Death to Recovery | A Story of Hope and Healing",
      date: "Apr 12, 2025",
      videoPlayed: false,
      thumbnailUrl: 'CM_y3X06Nkc',
      videoUrl: "https://www.youtube.com/embed/CM_y3X06Nkc"
    },
{
      name: "",
      profession: "",
      text: "Miraculous Recovery After Total Knee Replacement Surgery || Omni Hospitals, Kukatpally",
      date: "May 3, 2025",
      videoPlayed: false,
      thumbnailUrl: 'bxB3DoF2oYM',
      videoUrl: "https://www.youtube.com/embed/bxB3DoF2oYM"
    },
{
      name: "",
      profession: "",
      text: "Successful Knee Pain Surgery | Koteshwar Rao's Recovery Story",
      date: "Apr 15, 2025",
      videoPlayed: false,
      thumbnailUrl: 'dwNxv9xVl08',
      videoUrl: "https://www.youtube.com/embed/dwNxv9xVl08"
    },
    {
      name: "",
      profession: "",
      text: "Successful Knee Pain Surgery | Koteshwar Rao's Recovery Story",
      date: "Apr 15, 2025",
      videoPlayed: false,
      thumbnailUrl: 'pSc6uKMEBo8',
      videoUrl: "https://www.youtube.com/embed/pSc6uKMEBo8"
    },
    {
      name: "Dr. Vinay Kumar",
      profession: "General Physician",
      text: "Monsoon Dengue Fever || Dr. Vinay Kumar Explained Symptoms & Prevention!",
      date: "Jul 29, 2025 ",
      videoPlayed: false,
      thumbnailUrl: 'o2B35_wBzRs',
      videoUrl: "https://www.youtube.com/embed/o2B35_wBzRs"
    },
 {
      name: "Dr. Ranjith",
      profession: "Pediatric Orthopedic Specialist",
      text: "What is Clubfoot and How is it Treated? | Dr. Ranjith Nellore Mahesh Explains",
      date: "Jun 11, 2025",
      videoPlayed: false,
      thumbnailUrl: 'zWpwfj3dUZg',
      videoUrl: "https://www.youtube.com/embed/zWpwfj3dUZg"
    },
 {
      name: "Dr. Sandeep Perima",
      profession: "Nephrologist",
      text: "Protect Your Kidneys Before It's Too Late!",
      date: "Feb 22, 2025",
      videoPlayed: false,
      thumbnailUrl: '7K1n2aJBvTg',
      videoUrl: "https://www.youtube.com/embed/7K1n2aJBvTg"
    },
 {
      name: "Dr. Rajendar Byshetty",
      profession: "Consultant",
      text: "International Childhood Cancer Day",
      date: "Feb 15, 2024",
      videoPlayed: false,
      thumbnailUrl: 'HX2yOEx7h1A',
      videoUrl: "https://www.youtube.com/embed/HX2yOEx7h1A" 
    },
     {
      name: "Dr. Vijay Kumar Loya",
      profession: "Orthospine Surgeon",
      text: "Why Do Adults Suffer from Back Pain? ",
      date: "Jan 23, 2025",
      videoPlayed: false,
      thumbnailUrl: 'YNd6Gl4a9bU',
      videoUrl: "https://www.youtube.com/embed/YNd6Gl4a9bU"
    },
    {
      name: "Dr. Neelima",
      profession: "Plastic surgeon",
      text: "Breaking Myths About Plastic Surgery with Dr. Neelima",
      date: "Jan 2, 2025",
      videoPlayed: false,
      thumbnailUrl: 'LkkpdltkSD4',
      videoUrl: "https://www.youtube.com/embed/LkkpdltkSD4"
    },
    {
      name: "Dr. Vijay Kumar Loya",
      profession: "orthopedic spine surgeon",
      text: "Say Goodbye to Back & Neck Pain! | Expert Spine Care with Dr. Vijay Kumar Loya.",
      date: "Dec 26, 2024",
      videoPlayed: false,
      thumbnailUrl: 'VFi7xqWEYdk',
      videoUrl: "https://www.youtube.com/embed/VFi7xqWEYdk"
    },
    {
      name: "Dr. Anudeep",
      profession: "Consultant Neurologist",
      text: "National Epilepsy Awareness Day 💜 | Take Action to Break the Stigma",
      date: "Nov 17, 2024",
      videoPlayed: false,
      thumbnailUrl: 'E4nunyyFoV0',
      videoUrl: "https://www.youtube.com/embed/E4nunyyFoV0"
    },
    {
      name: "Dr. Bhanu Manjeera",
      profession: "General and Laparoscopic Surgeon",
      text: "Say Goodbye to Piles | Dr. Bhanu Manjeera Revised Treatment Guide at OMNI Hospitals",
      date: "Nov 6, 2024",
      videoPlayed: false,
      thumbnailUrl: 'KcSBTsbjdHc',
      videoUrl: "https://www.youtube.com/embed/KcSBTsbjdHc"
    },
    {
      name: "",
      profession: "Orthopaedic experts",
      text: "Let's Prevent The Alarming Rise Of Arthritis India",
      date: "Nov 1, 2024",
      videoPlayed: false,
      thumbnailUrl: 'xLSKOiq6gdo',
      videoUrl: "https://www.youtube.com/embed/xLSKOiq6gdo"
    },
    {
      name: "",
      profession: "",
      text: "A Remarkable Accident Recovery: #OmniSuccessStories",
      date: "Oct 24, 2024",
      videoPlayed: false,
      thumbnailUrl: 'wuR_fkYqn2o',
      videoUrl: "https://www.youtube.com/embed/wuR_fkYqn2o"
    },
      {
      name: "",
      profession: "",
      text: "A Successful Anterior Cervical Discectomy and Fusion #OmniSuccessStories",
      date: "Sep 12, 2024",
      videoPlayed: false,
      thumbnailUrl: '9JaQSyLqIjw',
      videoUrl: "https://www.youtube.com/embed/9JaQSyLqIjw"
    },
      {
      name: "",
      profession: "",
      text: "Say Goodbye to Knee Pain: Discover the Power of Minimally Invasive Knee Injections",
      date: "Aug 31, 2024",
      videoPlayed: false,
      thumbnailUrl: '1kyh9eLBBI8',
      videoUrl: "https://www.youtube.com/embed/1kyh9eLBBI8"
    },
      {
      name: "Dr. Payal Chitransi",
      profession: "Sr. Consultant - Department of ENT",
      text: "Let's Understand About Allergic Rhinitis",
      date: "Aug 20, 2024",
      videoPlayed: false,
      thumbnailUrl: '2oIZVtGQWuc',
      videoUrl: "https://www.youtube.com/embed/2oIZVtGQWuc"
    },
    {
      name: "Dr. Raju Kakarla",
      profession: "Consultant Pediatrician",
      text: "Let's Understand About The Right Use Of Paracetamol From Our Expert's Desk",
      date: "May 30, 2024",
      videoPlayed: false,
      thumbnailUrl: 'q86AX-CPJbo',
      videoUrl: "https://www.youtube.com/embed/q86AX-CPJbo"
    },
     {
      name: "",
      profession: "",
      text: "Let's Understand About Gangrene With A Patient Success Story #OmniSuccessStories",
      date: "May 17, 2024",
      videoPlayed: false,
      thumbnailUrl: 'VghI8dKGgb8',
      videoUrl: "https://www.youtube.com/embed/VghI8dKGgb8"
    },
  ];

  constructor(
    private http: HttpClient, 
    private activated_route: ActivatedRoute,
    private router: Router, 
    public sanitizer: DomSanitizer, 
    private newsservice: NewsService,
    private videoStateService: VideoStateService
  ) {}

  ngOnInit() {
    this.resizeListener = () => {
      this.videoStateService.stopAllVideos();
    };
    window.addEventListener('resize', this.resizeListener);

    // Subscribe to video state changes
    this.videoSubscription = this.videoStateService.currentlyPlayingVideo$.subscribe(videoId => {
      this.updateVideoStates(videoId);
    });

    this.activated_route.queryParams.subscribe(params => {
      console.log('Query Params:', params);
    });
    window.scrollTo(0, 0)
    this.onLoadNews();
  }

  showMedia(index: number) {
    this.media_type = index;
  }

  goToMediaDetails(obj: any) {
    this.router.navigate(['/news-media-details'], {
      queryParams: {
        selected_obj: JSON.stringify(obj)
      }
    });
  }

  onVideoPlay(idx: number): void {
    this.testimonials.forEach((item, i) => {
      item.videoPlayed = i === idx; // only the clicked one plays
    });
  }

  // Video management methods
  playVideo(idx: number): void {
    const testimonial = this.testimonials[idx];
    if (!testimonial) return;

    const videoId = this.extractVideoId(testimonial.videoUrl);
    this.videoStateService.setCurrentlyPlayingVideo(videoId);
  }

  private extractVideoId(url: string): string {
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : url;
  }

  private updateVideoStates(currentVideoId: string | null): void {
    this.testimonials.forEach((testimonial, index) => {
      const videoId = this.extractVideoId(testimonial.videoUrl);
      testimonial.videoPlayed = currentVideoId === videoId;
    });
  }

  isVideoPlaying(idx: number): boolean {
    const testimonial = this.testimonials[idx];
    if (!testimonial) return false;
    
    const videoId = this.extractVideoId(testimonial.videoUrl);
    return this.videoStateService.getCurrentlyPlayingVideo() === videoId;
  }



  onLoadNews(){
    this.http.get<any>('assets/json_data_files/news.json').subscribe((news_json:any)=>{
this.allNews = news_json.news;
console.log(this.allNews,'testing...');

    })
  }
}
