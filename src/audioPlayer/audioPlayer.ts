import { getContext } from '../context';
const player = require('play-sound')({});

class AudioPlayer {
  constructor() {}
  private _notification_path = (notification: string): string =>
    getContext().asAbsolutePath(`media/audio/${notification}.wav`);

  public playNotificationSound(notification: string) {
    player.play(this._notification_path(notification));
  }
}

export const audioPlayer = new AudioPlayer();
