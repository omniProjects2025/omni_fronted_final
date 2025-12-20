import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CanonicalService } from '../canonical.service';

import { Subscription } from 'rxjs';
import { VideoStateService } from '../services/video-state.service';

@Component({
  selector: 'app-patient-testimonials',
  templateUrl: './patient-testimonials.component.html',
  styleUrls: ['./patient-testimonials.component.css']
})
export class PatientTestimonialsComponent {

  public testimonials = [
    {
      name: "",
      profession: "",
      text: "",
      date: "",
      videoPlayed: false,
      thumbnailUrl: 'YdgeAoLsLjQ',
      videoUrl: "https://www.youtube.com/embed/YdgeAoLsLjQ"
    },
    {
      name: "",
      profession: "",
      text: "",
      date: "",
      videoPlayed: false,
      thumbnailUrl: 'dCY4o43AI9M',
      videoUrl: "https://www.youtube.com/embed/dCY4o43AI9M"
    },
    {
      name: "",
      profession: "",
      text: "",
      date: "",
      videoPlayed: false,
      thumbnailUrl: 'pSc6uKMEBo8',
      videoUrl: "https://www.youtube.com/embed/pSc6uKMEBo8"
    }

  ]

    private resizeListener: (() => void) | undefined;
    private videoSubscription: Subscription = new Subscription();
    private lastZoom: number = window.devicePixelRatio;
    private lastWindowWidth: number = window.innerWidth;

  constructor(private router: Router, private http: HttpClient, private titleService: Title, private metaService: Meta, private canonicalService: CanonicalService, public sanitizer: DomSanitizer,
    private videoStateService: VideoStateService,
    private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.videoStateService.stopAllVideos();
    this.resizeListener = () => {
      this.handleResizeOrZoom();
    };
    window.addEventListener('resize', this.resizeListener);
    this.videoSubscription = this.videoStateService.currentlyPlayingVideo$.subscribe(videoId => {
      this.updateVideoStates(videoId);
    });
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    this.videoSubscription.unsubscribe();
    this.videoStateService.stopAllVideos();
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

}
