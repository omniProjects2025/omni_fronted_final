import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements AfterViewInit {
  @Input() name: string = '';
  @Input() videoUrl: string = '';
  @Input() thumbnailUrl: string = '';
  @Input() videoPlayed: boolean = false;

  @Output() videoPlayedChange = new EventEmitter<boolean>();
  
  @ViewChild('videoIframe', { static: false }) videoIframe!: ElementRef;
  
  private isInitialized = false;
  public currentVideoUrl: string = '';
  private static currentlyPlayingVideo: VideoPlayerComponent | null = null;
  
  constructor(
    public sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(){
    if (!this.isInitialized) {
      this.isInitialized = true;
    }
  }

  ngAfterViewInit() {
    // Only set currentVideoUrl if not already playing
    if (!this.videoPlayed) {
      this.currentVideoUrl = this.videoUrl;
    }
  }

  ngOnDestroy() {
    this.isInitialized = false;
    // Clean up any cached data
    this.videoPlayed = false;
    this.videoPlayedChange.emit(false);
    
    // Remove event listeners
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange.bind(this));
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange.bind(this));
  }
  playVideo(): void {
    // Stop any currently playing video
    if (VideoPlayerComponent.currentlyPlayingVideo && 
        VideoPlayerComponent.currentlyPlayingVideo !== this) {
      VideoPlayerComponent.currentlyPlayingVideo.stopVideo();
    }
    // Only play if not already playing
    if (!this.videoPlayed) {
      this.videoPlayed = true;
      // Add autoplay=1 to YouTube URL if not present
      let url = this.videoUrl;
      if (url.includes('youtube.com/embed')) {
        url += (url.includes('?') ? '&' : '?') + 'autoplay=1';
      }
      this.currentVideoUrl = url;
      VideoPlayerComponent.currentlyPlayingVideo = this;
      this.videoPlayedChange.emit(true);
      this.cdr.detectChanges();
    }
  }

  stopVideo(): void {
    this.videoPlayed = false;
    this.currentVideoUrl = this.videoUrl;
    if (VideoPlayerComponent.currentlyPlayingVideo === this) {
      VideoPlayerComponent.currentlyPlayingVideo = null;
    }
    this.videoPlayedChange.emit(false);
    this.cdr.detectChanges();
  }

  onImageError(event: any): void {
    // Fallback to hqdefault.jpg if maxresdefault.jpg fails
    const img: HTMLImageElement = event.target;
    if (img.src.includes('maxresdefault.jpg')) {
      img.src = img.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
    }
  }

  onIframeLoad(): void {
    // Iframe loaded successfully
    // Add fullscreen event listeners
    this.addFullscreenEventListeners();
  }

  private addFullscreenEventListeners(): void {
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange.bind(this));
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange.bind(this));
  }

  private handleFullscreenChange(): void {
    // Handle fullscreen state changes
    // This method can be used for future fullscreen-specific logic
  }

  // Remove the getUnmutedVideoUrl method as we'll use the pipe instead

  
}