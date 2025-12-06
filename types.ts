export interface Thumbnail {
  quality: string;
  url: string;
  width: number;
  height: number;
  label: string;
}

export interface VideoDetails {
  id: string;
  thumbnails: Thumbnail[];
}

export enum ProcessState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
