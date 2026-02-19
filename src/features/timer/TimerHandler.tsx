import { useEffect, useImperativeHandle, useState, useRef, useCallback } from "react";

import { useConfig } from "@/features/config/useConfig";

import {
  type TimerHandle,
  type TimerHandlerCallbacks,
  type TimerHandlerOptions,
  TimerHandlerOptionDefaults,
} from "./types";

import Timer from "./Timer";

type Props = {
  ref: React.Ref<TimerHandle>;
  options?: TimerHandlerOptions;
  callbacks: TimerHandlerCallbacks;
};

export default function TimerHandler({
  ref,
  options = TimerHandlerOptionDefaults,
  callbacks,
}: Props) {
  const { config } = useConfig();
  const { theme, triggers } = config;
  const initialTime = config.timer;

  const { displayZeroDelay } = options;

  const intervalId = useRef<number | null>(null);
  const bgmAudio = useRef<HTMLAudioElement | null>(null);
  const activeClass = useRef<Set<string>>(new Set());

  const [currentTime, setCurrentTime] = useState(initialTime);

  const applyTrigger = useCallback(
    (key: string) => {
      if (!triggers) return;

      const trigger = triggers[key];
      if (!trigger) return;

      const audioPath = theme ? `/${theme}` : "";

      // BGM trigger
      if (trigger.bgm) {
        if (trigger.bgm == "off") {
          bgmAudio.current?.pause();
        } else {
          if (bgmAudio.current !== null) {
            bgmAudio.current.pause();
            bgmAudio.current.currentTime = 0;
            bgmAudio.current = null;
          }
          bgmAudio.current = new Audio(`${audioPath}/${trigger.bgm}`);
          bgmAudio.current.loop = true;
          bgmAudio.current.play();
        }
      }

      // SFX trigger
      if (trigger.sfx) {
        const sfx = new Audio(`${audioPath}/${trigger.sfx}`);
        sfx.play();
      }

      // CSS Class
      if (trigger.addClass) {
        if (!activeClass.current.has(trigger.addClass)) {
          activeClass.current.add(trigger.addClass);
          document.body.classList.add(trigger.addClass);
        }
      }
    },
    [triggers, theme],
  );

  // Stops the timer
  const stop = () => {
    if (intervalId.current === null) return;

    clearInterval(intervalId.current);
    intervalId.current = null;
  };

  // Executes every second
  const tick = () => {
    setCurrentTime((prev) => prev - 1);
  };

  // Starts the timer from initial with a delay
  const start = (delay: number = 0) => {
    if (intervalId.current) return;

    setTimeout(() => {
      applyTrigger("start");
      intervalId.current = setInterval(() => tick(), 1000);
    }, delay);
  };

  // Reset timer
  const reset = () => {
    stop();
    if (bgmAudio.current) {
      bgmAudio.current.pause();
      bgmAudio.current.currentTime = 0;
    }
    bgmAudio.current = null;
    setCurrentTime(initialTime);
  };

  useImperativeHandle(ref, () => {
    return {
      start,
      stop,
      reset,
    };
  });

  useEffect(() => {
    const updatedTime = currentTime - 1;

    // Check for onTick callback and "repeat" triggers
    callbacks.onTick?.(updatedTime);
    applyTrigger("repeat");

    // Check for triggers on specific seconds
    applyTrigger(updatedTime.toString());

    // Triggers on timer end
    if (updatedTime < 0) {
      applyTrigger("end");
      stop();

      setTimeout(() => {
        document.body.classList.remove(...activeClass.current.values());
        activeClass.current.clear();
        callbacks.onEnd?.();
      }, displayZeroDelay);
    }
  }, [currentTime, displayZeroDelay, callbacks, applyTrigger]);

  return <Timer timeLeft={currentTime} />;
}
