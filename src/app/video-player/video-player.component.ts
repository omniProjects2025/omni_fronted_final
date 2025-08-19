import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {
  @Input() videoUrl: string = '';
  @Input() thumbnailUrlId: string = '';
  @Input() videoPlayed: boolean = false;
  @Output() videoPlayedChange: EventEmitter<boolean> = new EventEmitter();
  @Output() videoStarted: EventEmitter<void> = new EventEmitter();
  @Output() videoStopped: EventEmitter<void> = new EventEmitter();

  player: any;

  ngOnInit(): void {
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    } else {
      this.initPlayer();
    }

    (window as any).onYouTubeIframeAPIReady = () => {
      this.initPlayer();
    };
  }

  playVideo(): void {
    this.videoPlayed = true;
    this.videoPlayedChange.emit(this.videoPlayed);

    setTimeout(() => this.initPlayer(), 100); // Wait for DOM to update
  }

  initPlayer(): void {
    if (!this.videoPlayed) return;

    const videoId = this.thumbnailUrlId;

    this.player = new (window as any).YT.Player(`yt-player-${videoId}`, {
      height: '140',
      width: '190',
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0,
        modestbranding: 1
      },
      events: {
        onStateChange: (event: any) => this.onPlayerStateChange(event)
      }
    });
  }

  onPlayerStateChange(event: any): void {
    const YT = (window as any).YT;
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        this.videoStarted.emit();
        break;
      case YT.PlayerState.PAUSED:
      case YT.PlayerState.ENDED:
        this.videoStopped.emit();
        break;
    }
  }
}