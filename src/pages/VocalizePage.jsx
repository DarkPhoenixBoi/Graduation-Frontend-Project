import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import UploadForm from "../components/Vocalize/UploadForm";
import ProcessingStatus from "../components/Vocalize/ProcessingStatus";
import AudioPlayer from "../components/Vocalize/AudioPlayer";
import PageSelector from "../components/Vocalize/PageSelector";
import { extractTextFromFile } from "../utils/fileUtils";
import { splitTextIntoChunks } from "../utils/audioUtils";
import { convertTextToAudio } from "../utils/apiUtils";

import styles from "./vocalizepage.module.css";

const VocalizePage = () => {
  const [file, setFile] = useState(null);
  const [startingPage, setStartingPage] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | extracting | chunking | processing | streaming | done
  const [audioChunks, setAudioChunks] = useState([]); // Holds successful audio blobs
  const [failedChunks, setFailedChunks] = useState([]);
  const [textChunks, setTextChunks] = useState([]); // Holds corresponding text for audio
  const [allTextChunks, setAllTextChunks] = useState([]); // Holds all text chunks for retrying
  const [chunkStatusList, setChunkStatusList] = useState([]); // "success" | "error"
  const [retrying, setRetrying] = useState(false);
  const streamingRef = useRef(false);
  const cancelRef = useRef(false);
  const retryingRef = useRef(false);
  const audioPlayerRef = useRef(null);
  const requestIdRef = useRef(0);
  const [error, setError] = useState(null);

  function waitUntil(conditionFn, interval = 100) {
    return new Promise((resolve) => {
      const check = () => {
        if (conditionFn()) {
          resolve();
        } else {
          setTimeout(check, interval);
        }
      };
      check();
    });
  }
  const processFileChunks = async (uploadedFile, startPage = 1) => {
    setStatus("chunking");
    cancelStreaming();
    requestIdRef.current += 1;
    const currentRequestId = requestIdRef.current;
    cancelRef.current = false;
    streamingRef.current = true;

    // Reset states before streaming
    setAudioChunks([]);
    setTextChunks([]);
    setChunkStatusList([]);
    setFailedChunks([]);
    setError(null);

    try {
      const text = await extractTextFromFile(uploadedFile, startPage);
      console.log("Starting Page", startPage, "Extracted Text:", text);
      const chunks = splitTextIntoChunks(text);
      console.log("Text Chunks", chunks);
      setAllTextChunks(chunks);
      setStatus("processing");

      for (let i = 0; i < chunks.length; i++) {
        if (cancelRef.current || requestIdRef.current !== currentRequestId) {
          console.warn("Streaming canceled or stale during processFileChunks.");
          break;
        }

        const chunk = chunks[i];
        await waitUntil(() => !retryingRef.current);

        if (requestIdRef.current !== currentRequestId) break;

        setTextChunks((prev) => [...prev, chunk]);

        try {
          const audioBlob = await convertTextToAudio(chunk);
          setStatus("streaming");

          if (cancelRef.current || requestIdRef.current !== currentRequestId) {
            console.warn("Stale response after audio conversion – skipped.");
            break;
          }

          if (audioBlob instanceof Blob) {
            setAudioChunks((prev) => [...prev, audioBlob]);
            setChunkStatusList((prev) => [...prev, "success"]);
          } else {
            setAudioChunks((prev) => [...prev, null]);
            setFailedChunks((prev) => [...prev, { index: i, text: chunk }]);
            setChunkStatusList((prev) => [...prev, "error"]);
          }
        } catch (err) {
          if (requestIdRef.current !== currentRequestId || cancelRef.current)
            break;
          console.error("❌ Error converting chunk to audio:", err);
          setAudioChunks((prev) => [...prev, null]);
          setFailedChunks((prev) => [...prev, { index: i, text: chunk }]);
          setChunkStatusList((prev) => [...prev, "error"]);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong during processing.");
      setStatus("idle");
    } finally {
      if (requestIdRef.current === currentRequestId) {
        streamingRef.current = false;
      }
    }
  };

  // Handler when user uploads a file
  const handleFileUpload = async (uploadedFile) => {
    // Stop current audio
    audioPlayerRef.current?.stopAudio();
    cancelStreaming();
    requestIdRef.current += 1;

    // Reset all states
    setFile(uploadedFile);
    setStatus("extracting");
    setAudioChunks([]);
    setTextChunks([]);
    setChunkStatusList([]);
    setFailedChunks([]);
    setAllTextChunks([]);
    setError(null);

    try {
      setStatus("choose_start");
    } catch (err) {
      console.error(err);
      setError("Failed to extract text.");
      setStatus("idle");
    }
  };

  const startStreamingFrom = async (startIndex) => {
    cancelStreaming();
    requestIdRef.current += 1;
    const currentRequestId = requestIdRef.current;
    cancelRef.current = false;
    streamingRef.current = true;

    setStatus("streaming");

    try {
      for (let i = startIndex; i < allTextChunks.length; i++) {
        if (cancelRef.current || requestIdRef.current !== currentRequestId) {
          console.warn(
            `Streaming canceled or stale during startStreamingFrom.`
          );
          break;
        }
        ``;
        const chunk = allTextChunks[i];

        if (chunkStatusList[i] === "success" || chunkStatusList[i] === "error")
          continue;

        await waitUntil(() => !retryingRef.current);

        // Abort before making request
        if (cancelRef.current || requestIdRef.current !== currentRequestId)
          break;

        setTextChunks((prev) => {
          const updated = [...prev];
          updated[i] = chunk;
          return updated;
        });
        setChunkStatusList((prev) => {
          const updated = [...prev];
          updated[i] = "loading";
          return updated;
        });

        try {
          const audioBlob = await convertTextToAudio(chunk);

          // Discard stale results
          if (cancelRef.current || requestIdRef.current !== currentRequestId) {
            console.warn(`Stale response at chunk ${i} — skipping.`);
            break;
          }

          if (audioBlob instanceof Blob) {
            setAudioChunks((prev) => {
              const updated = [...prev];
              updated[i] = audioBlob;
              return updated;
            });
            setChunkStatusList((prev) => {
              const updated = [...prev];
              updated[i] = "success";
              return updated;
            });
          } else {
            setAudioChunks((prev) => {
              const updated = [...prev];
              updated[i] = null;
              return updated;
            });
            setFailedChunks((prev) => [...prev, { index: i, text: chunk }]);
            setChunkStatusList((prev) => {
              const updated = [...prev];
              updated[i] = "error";
              return updated;
            });
          }
        } catch (err) {
          if (cancelRef.current || requestIdRef.current !== currentRequestId)
            break;

          console.error(`❌ Error converting chunk ${i} to audio:`, err);
          setAudioChunks((prev) => {
            const updated = [...prev];
            updated[i] = null;
            return updated;
          });
          setFailedChunks((prev) => [...prev, { index: i, text: chunk }]);
          setChunkStatusList((prev) => {
            const updated = [...prev];
            updated[i] = "error";
            return updated;
          });
        }
      }
    } finally {
      if (requestIdRef.current === currentRequestId) {
        streamingRef.current = false;
      }
    }
  };

  const retryGenerateAudio = async (index) => {
    const failedChunk = failedChunks.find((chunk) => chunk.index === index);
    const text = failedChunk ? failedChunk.text : null;
    if (!text) return null;
    setRetrying(true);
    retryingRef.current = true;
    try {
      const response = await axios.post(
        "http://localhost:8001/synthesize/",
        { text: text, block_cheat: false },
        { responseType: "blob" }
      );

      const blob = response.data;
      setAudioChunks((prev) => {
        const updated = [...prev];
        updated[index] = blob;
        return updated;
      });
      setChunkStatusList((prev) => {
        const updated = [...prev];
        updated[index] = "success";
        return updated;
      });
      return true;
    } catch (err) {
      console.error("Retry failed:", err);
      return false;
    } finally {
      setRetrying(false);
      retryingRef.current = false;
    }
  };
  const cancelStreaming = () => {
    cancelRef.current = true;
    streamingRef.current = false;
  };
  useEffect(() => {
    console.log("🎧 Audio chunks updated:", audioChunks);
  }, [audioChunks]);

  return (
    <div className={styles.vocalizePage}>
      <div className={styles.vocalizeContainer}>
        <h1 className={styles.vocalizeTitle}>Vocalize Your eBook</h1>

        {status === "idle" && (
          <div className={styles.vocalizeCard}>
            <UploadForm onUpload={handleFileUpload} />
          </div>
        )}

        {status === "choose_start" && (
          <div className={styles.vocalizeCard}>
            <PageSelector
              onSelect={(page) => {
                setStartingPage(page);
                processFileChunks(file, page);
              }}
            />
          </div>
        )}

        {status !== "idle" && (
          <div className={styles.vocalizeCard}>
            <ProcessingStatus status={status} error={error} />
          </div>
        )}

        {audioChunks.length > 0 && (
          <div className={styles.vocalizePlayer}>
            <AudioPlayer
              ref={audioPlayerRef}
              allTextChunks={allTextChunks}
              audioChunks={audioChunks}
              textChunks={textChunks}
              failedChunks={failedChunks}
              chunkStatusList={chunkStatusList}
              retryGenerateAudio={retryGenerateAudio}
              retrying={retrying}
              setRetrying={setRetrying}
              startStreamingFrom={startStreamingFrom}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VocalizePage;
