import React, { useRef, useState, useEffect } from "react";
import styles from "./BookPage.module.css";
import { Play, Pause, Volume2 } from "lucide-react";

function AudiobookPlayer({ audiobook }) {
  const { file_url: audioSrc } = audiobook || {};
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [volume, setVolume] = useState(1);

  const baseUrl = "http://localhost:8000";
  const audioUrl = audioSrc?.startsWith("http")
    ? audioSrc
    : `${baseUrl}/storage/${audioSrc}`;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    const percent = (audio.currentTime / audio.duration) * 100;
    setProgress(percent || 0);

    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60)
      .toString()
      .padStart(2, "0");
    setCurrentTime(`${minutes}:${seconds}`);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const newTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    const newVolume = e.target.value;
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <div className={styles.audioPlayer}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className={styles.controls}>
        <button onClick={togglePlay} className={styles.playButton}>
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          className={styles.progressBar}
        />

        <div className={styles.volumeControl}>
          <Volume2 size={18} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
}

export default AudiobookPlayer;
