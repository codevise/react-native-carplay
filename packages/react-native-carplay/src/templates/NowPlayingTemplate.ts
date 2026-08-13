import { ImageSourcePropType } from 'react-native';
import { CarPlay } from '../CarPlay';
import { NowPlayingMode } from '../interfaces/NowPlayingMode';
import { Template, TemplateConfig } from './Template';

export type NowPlayingButton = {
  id: string;
} & (
  | {
      type: 'shuffle' | 'add-to-library' | 'more' | 'playback' | 'repeat';
    }
  | {
      type: 'image';
      image: ImageSourcePropType;
    }
);

export interface NowPlayingTemplateConfig extends TemplateConfig {
  albumArtistButtonEnabled?: boolean;
  upNextButtonTitle?: string;
  upNextButtonEnabled?: boolean;
  onAlbumArtistButtonPressed?(): void;
  onUpNextButtonPressed?(): void;
  onButtonPressed?(e: { id: string; templateId: string }): void;
  buttons?: NowPlayingButton[];
}

export class NowPlayingTemplate extends Template<NowPlayingTemplateConfig> {
  public get type(): string {
    return 'nowplaying';
  }

  get eventMap() {
    return {
      albumArtistButtonPressed: 'onAlbumArtistButtonPressed',
      upNextButtonPressed: 'onUpNextButtonPressed',
      buttonPressed: 'onButtonPressed',
    };
  }

  /**
   * Switch the now playing screen between the standard layout and sports mode.
   *
   * The mode is held by the shared now playing template, so it outlives any
   * template you push and stays active until it is changed. A sports event clock
   * keeps counting on the system side, so remember to set the mode back to
   * `default` when playback moves to content that is not a two-team event.
   *
   * Requires iOS 18.4 or later; ignored on earlier versions.
   */
  public updateNowPlayingMode = (mode: NowPlayingMode) => {
    return CarPlay.bridge.updateNowPlayingMode(this.parseConfig(mode));
  };
}
