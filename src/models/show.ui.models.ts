export interface EpisodeData {
  id: string;
  episodeName: string;
  showName: string;
  webChannelName: string;
  airDate: string;
  airTime: string;
  number: number;
  url: string;
  genres: string[];
  image: string;
  language: string;
  rating: number;
  status: string;
  summary: string;
  prevEpisodeName?: string;
  prevEpisodeUrl?: string;
  nextEpisodeName: string;
  nextEpisodeUrl: string;
}

export interface DayEpisodeData {
  showId: string;
  showName: string;
  time: string;
  episodeNumber: number;
  image: string;
}

export interface DayData {
  isActive: boolean;
  name: string;
  date: string;
  dayEpisodesData: DayEpisodeData[];
}

export interface Crew {
  name: string;
  role: string;
  pic: string;
}
