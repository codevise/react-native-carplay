import { ImageSourcePropType } from 'react-native';

/**
 * One of the two teams in a sporting event, as displayed on the now playing
 * screen while sports mode is active.
 */
export interface SportsTeam {
  /**
   * A localized, user-visible name for this team.
   */
  name: string;
  /**
   * The team logo as a bundled image. Provide an image no larger than 350x350;
   * larger images are resized down.
   */
  logoImage?: ImageSourcePropType;
  /**
   * The team logo as a remote URL. Downloaded and cached natively, so repeated
   * score updates do not re-fetch it.
   */
  logoUrl?: string;
  /**
   * An abbreviation or initialism for this team, used when no logo is available
   * and while a remote logo is still downloading. A maximum of 3 characters is
   * displayed.
   */
  initials?: string;
  /**
   * An additional label displayed near the team name, such as a win-loss ratio
   * or table position. Depending on the car screen, a maximum of 15-20
   * characters is displayed.
   */
  standings?: string;
  /**
   * The score for this team in the current event. Depending on the car screen, a
   * maximum of 3 to 5 characters is displayed.
   */
  score: string;
  /**
   * An indicator that this team currently has possession. Only one team should
   * have possession at a given time.
   */
  possessionIndicatorImage?: ImageSourcePropType;
  /**
   * The possession indicator as a remote URL.
   */
  possessionIndicatorUrl?: string;
  /**
   * Marks the team with a star, indicating the user saved it as a favorite.
   */
  favorite?: boolean;
}

/**
 * The event clock. CarPlay counts up or down from the provided value on your
 * behalf, so this only needs to be pushed again when the value jumps or the
 * clock starts or stops.
 */
export interface SportsEventClock {
  /**
   * Seconds elapsed so far when `countsUp` is true, otherwise seconds remaining.
   */
  seconds: number;
  /**
   * True counts up from `seconds`, false counts down towards zero.
   */
  countsUp: boolean;
  /**
   * Freezes the clock at `seconds`, for example during a stoppage in play.
   */
  paused: boolean;
}

export interface SportsEventStatus {
  /**
   * Up to three short strings. The first should be the play period, using as few
   * characters as possible (for example "2." for the second half). The remaining
   * two can carry additional detail. All three should be kept brief so they
   * display well on car screens of various sizes.
   */
  text?: string[];
  /**
   * An optional graphic representing sport-specific state.
   */
  statusImage?: ImageSourcePropType;
  /**
   * An optional graphic representing sport-specific state, as a remote URL.
   */
  statusImageUrl?: string;
  /**
   * The event clock, if one applies to this event.
   */
  clock?: SportsEventClock;
}

/**
 * The now playing screen layout. `default` renders the standard metadata donated
 * to the shared now playing info center; `sports` renders the two-team sports
 * layout.
 *
 * Sports mode requires iOS 18.4 or later. On earlier versions updates are
 * ignored and the standard layout is used.
 */
export type NowPlayingMode =
  | { type: 'default' }
  | {
      type: 'sports';
      /**
       * The team on the left. Commonly, but not always, the away team. It stays
       * on the left in right-to-left languages and right-hand-drive vehicles.
       */
      leftTeam: SportsTeam;
      /**
       * The team on the right. Commonly, but not always, the home team. It stays
       * on the right in right-to-left languages and right-hand-drive vehicles.
       */
      rightTeam: SportsTeam;
      eventStatus?: SportsEventStatus;
      /**
       * A large, colorful background image. A gradient or crossfade including the
       * primary colors of both teams works best. Provide an image no larger than
       * 500x500.
       */
      backgroundArtworkImage?: ImageSourcePropType;
      /**
       * The background image as a remote URL.
       */
      backgroundArtworkUrl?: string;
      /**
       * Two colours, drawn natively into the left-to-right gradient Apple
       * recommends for this slot. Give them in the same order as the teams, as
       * `RRGGBB` or `#RRGGBB`.
       *
       * Takes precedence over `backgroundArtworkImage` and `backgroundArtworkUrl`.
       */
      backgroundGradientColors?: [string, string];
    };
