// Stable callback ref: set once on mount, preserving subsequent user changes.
export default function setVideoVolume(video) {
  if (video) video.volume = 0.25;
}
