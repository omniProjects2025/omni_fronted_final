import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() videoUrl: string = '';
  @Input() thumbnailUrlId: string = '';
  @Input() videoPlayed: boolean = false;
  @Input() width: number = 190; // Default width
  @Input() height: number = 140; // Default height
  @Input() aspectRatio: string = '16/9'; // Default aspect ratio
  @Output() videoPlayedChange: EventEmitter<boolean> = new EventEmitter();
  @Output() videoStarted: EventEmitter<void> = new EventEmitter();
  @Output() videoStopped: EventEmitter<void> = new EventEmitter();

  @ViewChild('playerContainer', { static: false }) playerContainer!: ElementRef;

  player: any;
  isPlayerReady: boolean = false;
  uniqueId: string = '';
  private externalStartListener = (event: any) => {
    try {
      const startedId: string = event?.detail;
      if (!startedId || startedId === this.uniqueId) return;
      if (this.videoPlayed) {
        // Another video started elsewhere → stop this one
        this.videoPlayed = false;
        this.videoPlayedChange.emit(false);
        this.stopVideo();
        try { this.player?.destroy?.(); } catch {}
        this.player = null;
        this.isPlayerReady = false;
      }
    } catch {}
  };

  ngOnInit(): void {
    // Generate unique ID for this player instance
    this.uniqueId = `yt-player-${this.thumbnailUrlId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.loadYouTubeAPI();
    // Listen for global start events from other instances to enforce single playback
    window.addEventListener('omni-video-start', this.externalStartListener as EventListener);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoPlayed'] && !changes['videoPlayed'].firstChange) {
      if (this.videoPlayed) {
        // Initialize player when toggled on from parent
        setTimeout(() => this.initPlayer());
      } else {
        // Stop and destroy when toggled off from parent
        if (this.player) {
          try { this.player.stopVideo?.(); } catch {}
          try { this.player.destroy?.(); } catch {}
        }
        this.player = null;
        this.isPlayerReady = false;
      }
    }

    if ((changes['width'] || changes['height']) && this.player && this.isPlayerReady) {
      try {
        this.player.setSize(this.width, this.height);
      } catch {}
    }
  }

  loadYouTubeAPI(): void {
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Wait for YouTube API to load
    const checkYT = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        this.initPlayer();
      } else {
        setTimeout(checkYT, 100);
      }
    };
    checkYT();
  }

  initPlayer(): void {
    if (!this.videoPlayed || !this.thumbnailUrlId) return;

    const videoId = this.thumbnailUrlId;
    const playerElement = document.getElementById(this.uniqueId);
    
    if (!playerElement) {
      console.error('Player element not found');
      return;
    }

    // Destroy existing player if it exists
    if (this.player) {
      try { this.player.stopVideo?.(); } catch {}
      try { this.player.destroy?.(); } catch {}
    }

    this.player = new (window as any).YT.Player(this.uniqueId, {
      height: this.height.toString(),
      width: this.width.toString(),
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        showinfo: 0,
        fs: 1, // Allow fullscreen
        iv_load_policy: 3, // Hide annotations
        cc_load_policy: 0, // Hide closed captions
        playsinline: 1, // Play inline on mobile
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: (event: any) => {
          this.isPlayerReady = true;
          console.log('YouTube player ready');
        },
        onStateChange: (event: any) => this.onPlayerStateChange(event),
        onError: (event: any) => {
          console.error('YouTube player error:', event.data);
        }
      }
    });
  }

  onPlayerStateChange(event: any): void {
    switch (event.data) {
      case (window as any).YT.PlayerState.PLAYING:
        // Broadcast globally so other players stop
        try { window.dispatchEvent(new CustomEvent('omni-video-start', { detail: this.uniqueId })); } catch {}
        this.videoStarted.emit();
        break;
      case (window as any).YT.PlayerState.ENDED:
      case (window as any).YT.PlayerState.PAUSED:
        this.videoStopped.emit();
        break;
    }
  }

  playVideo(): void {
    if (!this.videoPlayed) {
      this.videoPlayed = true;
      this.videoPlayedChange.emit(true);
      this.initPlayer();
    }
  }

  // Method to stop video programmatically
  stopVideo(): void {
    if (this.player) {
      try { this.player.stopVideo?.(); } catch {}
    }
  }

  // Method to pause video programmatically
  pauseVideo(): void {
    if (this.player && this.isPlayerReady) {
      this.player.pauseVideo();
    }
  }

  // Method to play video programmatically
  playVideoProgrammatically(): void {
    if (this.player && this.isPlayerReady) {
      this.player.playVideo();
    }
  }

  // Cleanup method
  ngOnDestroy(): void {
    if (this.player) {
      try { this.player.stopVideo?.(); } catch {}
      try { this.player.destroy?.(); } catch {}
    }
    try { window.removeEventListener('omni-video-start', this.externalStartListener as EventListener); } catch {}
  }
}