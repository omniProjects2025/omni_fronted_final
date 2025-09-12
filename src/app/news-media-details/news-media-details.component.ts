import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../services/news.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-news-media-details',
  templateUrl: './news-media-details.component.html',
  styleUrls: ['./news-media-details.component.css']
})
export class NewsMediaDetailsComponent {
  getting_media_object: any = null;
  safeVideoUrl: SafeHtml | null = null;
  news_details: any[] = [];
  recentnewposts = [
    'assets/images/media_recent_post.svg',
    'assets/images/media_recent_post.svg',
    'assets/images/media_recent_post.svg'
  ];

  constructor(private sanitizer: DomSanitizer,private http: HttpClient, private activated_routes: ActivatedRoute, private newsservice: NewsService) {
    // this.activatedRoutesData();
  }

  ngOnInit() {
    this.onLoadNewsDetails();
    
  }
  

  activatedRoutesData() {
    this.activated_routes.queryParams.subscribe(params => {
      try {
        this.getting_media_object = JSON.parse(params['selected_obj']);
        if (this.getting_media_object?.vedio_url) {
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getting_media_object.vedio_url) as any;
      console.log(this.safeVideoUrl,'this.safeVideoUrl');
      
    }
        this.news_details = this.news_details.filter((news: any) => news.title !== this.getting_media_object.title)
        console.log(this.getting_media_object, 'parsed media object');
      } catch (error) {
        console.error('Error parsing selected_obj', error);
        this.getting_media_object = null;
      }
    });
  }

  // getNewsDetails() {
  //   this.newsservice.getAllNews().subscribe((response: any) => {
  //     if (response && response.data && response.data.length > 0) {
  //       this.news_details = response.data[0].news;
  //       console.log(this.news_details, 'news_details..');
  //     } else {
  //       console.error('No data found in the response');
  //     }
  //   }, (error: any) => {
  //     console.error('Error fetching news details:', error);
  //   });
  // }

  onLoadNewsDetails() {
    this.http.get<any>('assets/json_data_files/news.json').subscribe((news_json: any) => {
      this.news_details = news_json.news;
      console.log(this.news_details, 'this.news_details');
      this.activatedRoutesData()

    })
  }

  getNewsDetails(news_title: any) {
    this.getting_media_object = this.news_details.filter((news: any) => news_title == news.title)[0];
  }

  callBack(): void {
    const dum: number[] = [1, 11, 3, 13, 5, 15, 7, 17];
    if (dum && dum.length > 0) {
      const even_numbers = dum.filter((num) => num % 2 == 0);
      console.log(even_numbers, 'even_numbers');
    } else {
      const odd_numbers = dum.filter((data) => data % 2 != 0);
      console.log(odd_numbers, 'odd_numbers');
    }
  }

  categoryData() {
    const categoryData = ["cardio", "ortho", "neuro", "gastro", "urology"];
  }
  newCardsSwap(news: any, index: number) {
    this.news_details[index] = this.getting_media_object;
    this.getting_media_object = news;
  }

}