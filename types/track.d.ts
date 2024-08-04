export interface TrackInterface {
  title: string;
  url: string;
  estimatedTimeUntilPlayed?: number;
  length: string;
  positionInUpcoming?: string;
  positionInQueue?: number;
  thumbnailUrl: string;
  requestedBy?: string;
  requesterAvatarURL?: string;
}
