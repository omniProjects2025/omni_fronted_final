import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent {
  @Input() name: string = '';
  @Input() videoUrl: string = '';
  @Input() thumbnailUrl: string = '';
  @Input() videoPlayed: boolean = false;

  @Output() videoPlayedChange = new EventEmitter<boolean>();
  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit(){
    console.log('videoUrl:', this.videoUrl,this.thumbnailUrl);
    
  }
  playVideo(): void {
    this.videoPlayed = true;
    this.videoPlayedChange.emit(true); // 👈 notify parent
  }

  stopVideo(): void {
    this.videoPlayed = false;
    this.videoPlayedChange.emit(false); // 👈 notify parent
  }

  getUnmutedVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `${url}?autoplay=1&mute=0&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`
    );
  }

  
}