// mm:MaZUn5xHXZ — Sun* Kudos Live Board type definitions

export interface KudosUser {
  id: string;
  name: string;
  avatarUrl: string;
  department: string;
  stars: number;
  badge: string;
}

export interface Kudos {
  id: string;
  sender: KudosUser;
  receiver: KudosUser;
  contentVi: string;
  hashtags: string[];
  imageUrls: string[];
  likeCount: number;
  likedByMe: boolean;
  isOwn: boolean;
  postedAt: string;
}

export interface Hashtag {
  id: string;
  label: string;
  count: number;
}

export interface Department {
  id: string;
  name: string;
}

export interface LeaderboardEntry {
  user: KudosUser;
  description: string;
}

export interface KudosStats {
  received: number;
  sent: number;
  hearts: number;
  boxOpened: number;
  boxUnopened: number;
}

export interface SpotlightNode {
  name: string;
  kudosCount: number;
  postedAt: string;
  highlighted?: boolean;
}
