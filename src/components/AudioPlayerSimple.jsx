import React, { useState, useRef, useEffect } from "react";
import styles from "./AudioPlayerSimple.module.css";
import { Play, Pause, Volume2, ChevronUp, ChevronDown } from "lucide-react";

const AudioPlayerSimple = ({ audiobookUrl, title, image }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDocked, setIsDocked] = useState(true);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className={`${styles.audioPlayer} ${isDocked ? styles.docked : styles.expanded}`}
    >
      <button
        className={styles.toggleButton}
        onClick={() => setIsDocked(!isDocked)}
      >
        {isDocked ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {!isDocked && (
        <div className={styles.expandedArea}>
          <div className={styles.expandedBookPreview}>
            <img
              src={image}
              alt={title}
              style={{ maxWidth: 100, borderRadius: "0.5rem" }}
            />
            <h2>{title}</h2>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        src={audiobookUrl}
        onEnded={() => setIsPlaying(false)}
      />

      <div className={styles.controlBar}>
        <div className={styles.leftSection}>
          <span className={styles.bookTitle}>{title}</span>
        </div>

        <div className={styles.playbackControlsWrapper}>
          <div className={styles.playbackControls}>
            <button onClick={togglePlay}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.iconControl}>
            <Volume2 size={18} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerSimple;
