import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCALE = SCREEN_WIDTH / 393;

export const SHARE_BASE_URL = 'https://backend.fold.taohq.org/api/shares/public';

export const ENTRY_TYPE_LABELS: Record<string, string> = {
  text: 'Text Entry',
  audio: 'Voice Note',
  photo: 'Photo',
  video: 'Video',
  story: 'Story',
};

export const ENTRY_TYPE_EMOJI: Record<string, string> = {
  text: 'T',
  audio: 'A',
  photo: 'P',
  video: 'V',
  story: 'S',
};
