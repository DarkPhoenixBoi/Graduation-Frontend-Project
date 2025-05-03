import React from "react";
import styles from "./ProcessingStatus.module.css";

const ProcessingStatus = ({ status, error }) => {
  const getStatusMessage = () => {
    switch (status) {
      case "extracting":
        return "Extracting text from the file...";
      case "chunking":
        return "Chunking text into manageable parts...";
      case "processing":
        return "Converting text to audio...";
      case "streaming":
        return "Streaming audiobook...";
      case "done":
        return "Conversion complete!";
      default:
        return "Waiting for file upload...";
    }
  };

  return (
    <div className={styles.processingStatus}>
      {error && <p className={styles.error}>{error}</p>}
      <p>{getStatusMessage()}</p>
    </div>
  );
};

export default ProcessingStatus;
