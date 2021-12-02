declare module "shaka-player/dist/shaka-player.ui" {
  export = shaka;
}

type ValueOf<T> = T[keyof T];

type Chapter = {
  title: string;
  timecode: number;
};

interface ImageFormat {
  addMetadata(metadata: Partial<ImageMetadata>);
  toBinaryString(): string;
}

type ImageFormatDesc = {
  mimeType: string;
  label: string;
  parseBinaryString: (s: string) => ImageFormat | undefined;
};

type ImageMetadata = {
  title: string;
  comment: string;
};

type Keybinding<ScopeT extends string, ActionT extends string> = {
  /**
   * Modifier to be pressed.
   *
   * See definition of `const Modifier`.
   */
  mod: "None" | "CtrlMeta" | "Shift" | "Alt";

  /**
   * Name of the key to be bound.
   */
  key: string;

  /**
   * Boolean to indicate that the keypress must / must not be repeated;
   * undefined or null to allow both.
   */
  repeat: boolean | null | undefined;

  /**
   * Active keyboard scope for which the keybinding is relevant; undefined or
   * null to allow any scope.
   */
  scope: ScopeT | null | undefined;

  /**
   * Key of the action to be executed for that keybinding.
   */
  action: ActionT;

  /**
   * Whether or not to propagate the event for further handling.
   */
  propagate: ?boolean;

  /**
   * Kind of keybinding as used for grouping in help modal.
   */
  kind: string;

  /**
   * Order value (relative to `kind`) as used in help modal.
   */
  order: number;
};

type PhrasesDict = Record<string, string>;
type LangDef = {
  twoLetterIsoCode: string;
  phrases: PhrasesDict;
};

type MetadataArray = {
  metadata: Record<string, string[]>;
  screenshotFields: string[];
};

interface Network<T> {
  get(url: string): Promise<T>;
  abortPending(): void;
}

/**
 * Signals chapters available in current video.
 *
 * Should be dispatched on a Shaka control ({@link shaka.ui.Controls}).
 */
interface SxndChaptersEvent
  extends CustomEvent<{
    chapters: import("./Chapters").default;
  }> {}

/**
 * Signals information about FPS of current video.
 *
 * Should be dispatched on a Shaka control ({@link shaka.ui.Controls}).
 */
interface SxndFpsEvent
  extends CustomEvent<{
    vifa: VideoFrame | null;
    fps: number | null;
  }> {}

/**
 * Signals that thumbnail previews should be closed.
 *
 * Should be dispatched on a Shaka control ({@link shaka.ui.Controls}).
 */
interface SxndThumbsCloseEvent extends Event {}

/**
 * Signals variant groups of current video.
 *
 * Should be dispatched on a Shaka control ({@link shaka.ui.Controls}).
 */
interface SxndVariantGroupsEvent
  extends CustomEvent<{
    variantGroups: import("./VariantGroups").default;
  }> {}

interface VideoFrame {
  get(): number;
}
