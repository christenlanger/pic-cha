import type { Triggers } from "../types";

type GameControllerCallbacks = {
    onTick?: (timeLeft: number) => void;    // called every second
    onEnd?: () => void;                     // called after timer expires
}

export class GameController {
    private timer: number;
    private delay: number;
    private theme: string;
    private displayZeroDelay: number;
    private triggers: Triggers;
    private intervalId: number | null = null;
    private callbacks: GameControllerCallbacks;
    private currentTime: number;
    private bgmAudio: HTMLAudioElement | null = null;
    private activeClasses = new Set<string>();

    constructor(timer: number, delay: number, theme: string, displayZeroDelay: number = 0, triggers: Triggers = {}, callbacks: GameControllerCallbacks = {}) {
        this.timer = timer;
        this.currentTime = timer;
        this.delay = delay;
        this.theme = theme;
        this.displayZeroDelay = displayZeroDelay;
        this.triggers = triggers;
        this.callbacks = callbacks;
    }

    start() {
        setTimeout(() => {
            this.applyTrigger("start");
            this.intervalId = window.setInterval(() => this.tick(), 1000);
        }, this.delay);
    }

    // Executes every second
    private tick() {
        this.currentTime--;

        // Check for onTick callback and "repeat" triggers
        this.callbacks.onTick?.(this.currentTime);
        this.applyTrigger("repeat");

        // Check for triggers on specific seconds
        this.applyTrigger(this.currentTime.toString());

        // On end
        if (this.currentTime <= 0) {
            this.applyTrigger("end");
            this.stop();

            setTimeout(() => {
                document.body.classList.remove(...this.activeClasses.values());
                this.activeClasses.clear();
                this.callbacks.onEnd?.();
            }, this.displayZeroDelay);
        }
    }

    // Executes triggers defined from config
    private applyTrigger(key: string) {
        const trigger = this.triggers[key];
        if (!trigger) return;

        // BGM trigger
        if (trigger.bgm) {
            if (trigger.bgm == "off") {
                this.bgmAudio?.pause();
            }
            else if (this.bgmAudio === null) {
                this.bgmAudio = new Audio(`${this.theme}/${trigger.bgm}`);
                this.bgmAudio.loop = true;
                this.bgmAudio.play();
            }
        }

        // SFX trigger
        if (trigger.sfx) {
            const sfx = new Audio(`${this.theme}/${trigger.sfx}`);
            sfx.play();
        }

        // CSS class
        if (trigger.addClass) {
            if (!this.activeClasses.has(trigger.addClass)) {
                this.activeClasses.add(trigger.addClass);
                document.body.classList.add(trigger.addClass);
            }
        }
    }

    stop() {
        if (this.intervalId === null) return;

        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    reset() {
        this.stop();
        this.bgmAudio = null;
        this.currentTime = this.timer;
    }
}