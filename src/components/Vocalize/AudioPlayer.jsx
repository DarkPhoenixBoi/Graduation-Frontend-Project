import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./AudioPlayer.module.css";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Zap,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const AudioPlayer = forwardRef(
  (
    {
      allTextChunks,
      audioChunks,
      textChunks = [],
      chunkStatusList = [],
      retryGenerateAudio,
      retrying,
      startStreamingFrom,
    },
    ref
  ) => {
    const [audioIndex, setAudioIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [waitingForNext, setWaitingForNext] = useState(false);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isBuffering, setIsBuffering] = useState(false);
    const audioRef = useRef(null);
    const latestRequestedIndexRef = useRef(null);

    const [isDocked, setIsDocked] = useState(true);

    const isFailedChunk = chunkStatusList[audioIndex] === "error";

    const bookTitle = "Book Title"; // Placeholder for book title
    const bookDescription = "Book Description"; // Placeholder for book description
    const bookCoverUrl = "https://via.placeholder.com/150"; // Placeholder for book cover URL

    // Expose stopAudio to parent
    useImperativeHandle(ref, () => ({
      stopAudio: () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
          audioRef.current = null;
        }
        setIsPlaying(false);
      },
    }));
    // Only change audio when audioIndex changes
    useEffect(() => {
      if (chunkStatusList[audioIndex] === "error") return;

      const currentChunk = audioChunks[audioIndex];
      if (!currentChunk) return;

      // ❗️Pause the existing audio first
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audioUrl = URL.createObjectURL(currentChunk);
      const audio = new Audio(audioUrl);

      audio.volume = volume;
      audio.playbackRate = playbackRate;
      audioRef.current = audio;

      setIsBuffering(true);

      audio.oncanplaythrough = () => {
        setIsBuffering(false);
        if (isPlaying) {
          audio.play();
        }
      };

      audio.onended = () => {
        if (audioIndex < audioChunks.length - 1) {
          setAudioIndex((prev) => prev + 1);
        } else {
          setWaitingForNext(true);
        }
      };

      return () => {
        audio.pause();
        audio.src = "";
        // URL.revokeObjectURL(audioUrl);
      };
    }, [audioIndex, audioChunks[audioIndex], chunkStatusList[audioIndex]]);

    // When a new chunk is received and we're waiting, advance to next
    useEffect(() => {
      if (waitingForNext && audioIndex < audioChunks.length - 1) {
        setWaitingForNext(false);
        setAudioIndex((prev) => prev + 1);
      }
    }, [audioChunks.length, waitingForNext, audioIndex]);

    useEffect(() => {
      if (isPlaying && audioRef.current && audioRef.current.paused) {
        audioRef.current.play();
      }
    }, [isPlaying]);

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }, [volume]);

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.playbackRate = playbackRate;
      }
    }, [playbackRate]);

    const retryChunk = async () => {
      const success = await retryGenerateAudio(audioIndex);
      if (!success) {
        alert("Retry failed. Please try again later.");
      }
    };

    const playAudio = () => {
      if (!isFailedChunk && audioChunks[audioIndex] != null) {
        setIsPlaying(true);
      } else {
        let nextValidIndex = audioIndex + 1;
        while (
          nextValidIndex < audioChunks.length &&
          (audioChunks[nextValidIndex] == null ||
            chunkStatusList[nextValidIndex] === "error")
        ) {
          nextValidIndex++;
        }
        if (nextValidIndex < audioChunks.length) {
          setAudioIndex(nextValidIndex);
          setIsPlaying(true);
        }
      }
    };

    const pauseAudio = () => {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    };

    const replayAudio = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setIsPlaying(true);
    };

    const skipToNext = () => {
      if (audioIndex < allTextChunks.length - 1) {
        goToChunk(audioIndex + 1);
      }
    };

    const skipToPrevious = () => {
      if (audioIndex > 0) {
        goToChunk(audioIndex - 1);
      }
    };

    const handleVolumeChange = (e) => {
      setVolume(parseFloat(e.target.value));
    };

    const handlePlaybackRateChange = (e) => {
      setPlaybackRate(parseFloat(e.target.value));
    };

    const goToChunk = (index, autoPlay = true) => {
      const status = chunkStatusList[index];

      latestRequestedIndexRef.current = index;

      if (status === "success" && audioChunks[index]) {
        setAudioIndex(index);
        if (autoPlay) setIsPlaying(true);
      } else if (status === "error") {
        setAudioIndex(index);
      } else if (
        status === "loading" ||
        audioChunks[index] == null ||
        chunkStatusList[index] == null
      ) {
        // Prevent spamming: only stream if this is still the latest request
        setAudioIndex(index);
        if (autoPlay) setIsPlaying(true);

        // Short delay to give time for potential fast skips
        setTimeout(() => {
          if (latestRequestedIndexRef.current === index) {
            startStreamingFrom(index);
          }
        }, 1500); // can tweak delay for responsiveness
      }
    };

    return (
      <div
        className={`${styles.audioPlayer} ${
          isDocked ? styles.docked : styles.expanded
        }`}
      >
        <button
          className={styles.toggleButton}
          onClick={() => setIsDocked(!isDocked)}
        >
          {isDocked ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {/* Expanded Area Above Player */}
        {!isDocked && (
          <div className={styles.expandedArea}>
            <div className={styles.expandedBookPreview}>
              <h2>{bookTitle}</h2>
            </div>

            {isBuffering && <p className={styles.status}>Buffering...</p>}
            {(chunkStatusList[audioIndex] === "loading" ||
              audioChunks[audioIndex] == null) && (
              <p className={styles.status}>Generating audio...</p>
            )}

            {textChunks[audioIndex] && (
              <div
                className={`${styles.transcript} ${
                  isFailedChunk ? styles.transcriptFailed : ""
                }`}
              >
                <p>{textChunks[audioIndex]}</p>
                {isFailedChunk && (
                  <div>
                    <button
                      onClick={retryChunk}
                      disabled={retrying}
                      className={styles.retryButton}
                    >
                      {retrying ? "Retrying..." : "Retry"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <audio ref={audioRef} style={{ display: "none" }} />

        {/* Fixed Control Bar */}
        <div className={styles.controlBar}>
          <div className={styles.leftSection}>
            <span className={styles.bookTitle}>{bookTitle}</span>
          </div>

          <div className={styles.playbackControlsWrapper}>
            <div className={styles.playbackControls}>
              <button onClick={skipToPrevious} title="Previous">
                <SkipBack size={20} />
              </button>
              {isFailedChunk ? (
                <button onClick={retryChunk} disabled={retrying} title="Retry">
                  {retrying ? "…" : "⟳"}
                </button>
              ) : isPlaying ? (
                <button onClick={pauseAudio} title="Pause">
                  <Pause size={20} />
                </button>
              ) : (
                <button
                  onClick={playAudio}
                  disabled={
                    chunkStatusList[audioIndex] === "loading" ||
                    audioChunks[audioIndex] == null
                  }
                  title="Play"
                >
                  <Play size={20} />
                </button>
              )}

              <button onClick={skipToNext} title="Next">
                <SkipForward size={20} />
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
                onChange={handleVolumeChange}
              />
            </div>
            <div className={styles.iconControl}>
              <Zap size={18} />
              <select value={playbackRate} onChange={handlePlaybackRateChange}>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}x
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Seek Bar */}
        <div className={styles.chunkSlider}>
          <input
            type="range"
            min="0"
            max={allTextChunks.length - 1}
            value={audioIndex}
            onChange={(e) => goToChunk(Number(e.target.value))}
            className={styles.slider}
          />
          <div className={styles.chunkLabels}>
            <span>
              {audioIndex + 1} / {allTextChunks.length}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

export default AudioPlayer;
