import { Http, URLSearchParams, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { EchoesState } from '../store';
import { NowPlaylistActions, YoutubeMediaPlaylist } from '../store/now-playlist';
import { YoutubeVideosInfo } from './youtube-videos-info.service';

@Injectable()
export class NowPlaylistService {
  public playlist$: Observable<YoutubeMediaPlaylist>;

  constructor(
    public store: Store<EchoesState>,
    private youtubeVideosInfo: YoutubeVideosInfo,
    private nowPlaylistActions: NowPlaylistActions
  ) {
    this.playlist$ = this.store.select(state => state.nowPlaylist);
  }

  queueVideo(mediaId: string) {
    return this.youtubeVideosInfo.api
      .list(mediaId)
      .map(items => items[0]);
  }

  queueVideos(medias: GoogleApiYouTubeVideoResource[]) {
    this.store.dispatch({ type: NowPlaylistActions.QUEUE_VIDEOS, payload: medias });
  }

  removeVideo(media) {
    this.store.dispatch({ type: NowPlaylistActions.REMOVE, payload: media });
  }

  selectVideo(media) {
    this.store.dispatch({ type: NowPlaylistActions.SELECT, payload: media });
  }

  updateFilter(filter: string) {
    this.store.dispatch({ type: NowPlaylistActions.FILTER_CHANGE, payload: filter });
  }

  clearPlaylist() {
    this.store.dispatch({ type: NowPlaylistActions.REMOVE_ALL });
  }

  selectNextIndex() {
    this.store.dispatch({ type: NowPlaylistActions.SELECT_NEXT });
  }

  selectPreviousIndex() {
    this.store.dispatch({ type: NowPlaylistActions.SELECT_PREVIOUS });
  }

  getCurrent() {
    let media;
    this.playlist$.take(1).subscribe(playlist => {
      media = playlist.videos.find(video => video.id === playlist.index);
    });
    return media;
  }

  updateIndexByMedia(mediaId: string) {
    this.store.dispatch(this.nowPlaylistActions.updateIndexByMedia(mediaId));
  }

  isInLastTrack(): boolean {
    let nowPlaylist: YoutubeMediaPlaylist;
    this.playlist$.take(1).subscribe(_nowPlaylist => nowPlaylist = _nowPlaylist);
    const currentVideoId = nowPlaylist.index;
    const indexOfCurrentVideo = nowPlaylist.videos.findIndex(video => video.id === currentVideoId);
    const isCurrentLast = indexOfCurrentVideo + 1 === nowPlaylist.videos.length;
    return isCurrentLast;
  }
}
