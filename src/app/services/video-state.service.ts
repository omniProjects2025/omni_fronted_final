import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoStateService {
  private currentlyPlayingVideo = new BehaviorSubject<string | null>(null);
  public currentlyPlayingVideo$ = this.currentlyPlayingVideo.asObservable();

  constructor() {}

  // Set the currently playing video
  setCurrentlyPlayingVideo(videoId: string | null): void {
    this.currentlyPlayingVideo.next(videoId);
  }

  // Get the currently playing video ID
  getCurrentlyPlayingVideo(): string | null {
    return this.currentlyPlayingVideo.value;
  }

  // Stop all videos
  stopAllVideos(): void {
    this.currentlyPlayingVideo.next(null);
  }
}
