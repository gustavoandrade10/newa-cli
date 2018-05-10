declare type OraSpinnerName =
    'dots'
    | 'dots2'
    | 'dots3'
    | 'dots4'
    | 'dots5'
    | 'dots6'
    | 'dots7'
    | 'dots8'
    | 'dots9'
    | 'dots10'
    | 'dots11'
    | 'dots12'
    | 'line'
    | 'line2'
    | 'pipe'
    | 'simpleDots'
    | 'simpleDotsScrolling'
    | 'star'
    | 'star2'
    | 'flip'
    | 'hamburger'
    | 'growVertical'
    | 'growHorizontal'
    | 'balloon'
    | 'balloon2'
    | 'noise'
    | 'bounce'
    | 'boxBounce'
    | 'boxBounce2'
    | 'triangle'
    | 'arc'
    | 'circle'
    | 'squareCorners'
    | 'circleQuarters'
    | 'circleHalves'
    | 'squish'
    | 'toggle'
    | 'toggle2'
    | 'toggle3'
    | 'toggle4'
    | 'toggle5'
    | 'toggle6'
    | 'toggle7'
    | 'toggle8'
    | 'toggle9'
    | 'toggle10'
    | 'toggle11'
    | 'toggle12'
    | 'toggle13'
    | 'arrow'
    | 'arrow2'
    | 'arrow3'
    | 'bouncingBar'
    | 'bouncingBall'
    | 'smiley'
    | 'monkey'
    | 'hearts'
    | 'clock'
    | 'earth'
    | 'moon'
    | 'runner'
    | 'pong'
    | 'shark'
    | 'dqpb';

declare type OraColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray';

declare interface OraSpinner {
    interval?: number;
    frames: string[];
}

declare interface PersistOptions {
    symbol?: string;
    text?: string;
}

declare interface OraOptions{
    text?: string;
    spinner?: OraSpinnerName | OraSpinner;
    color?: OraColor;
    interval?: number;
    stream?: NodeJS.WritableStream;
    enabled?: boolean;
    hideCursor?: boolean;
}

declare class Ora {
    start(text?: string): Ora;

    stop(): Ora;

    succeed(text?: string): Ora;

    fail(text?: string): Ora;

    warn(text?: string): Ora;

    info(text?: string): Ora;

    stopAndPersist(options?: PersistOptions | string): Ora;

    clear(): Ora;

    render(): Ora;

    frame(): Ora;

    text: string;

    color: OraColor;

    frameIndex: number;
}