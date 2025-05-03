import React, { useRef } from "react";
import styles from "./UploadForm.module.css";

const UploadForm = ({ onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" || file.name.endsWith(".epub"))
    ) {
      onUpload(file);
    } else {
      alert("Please upload a valid PDF or EPUB file.");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.uploadForm}>
      <input
        type="file"
        accept=".pdf,.epub"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button className={styles.uploadButton} onClick={handleButtonClick}>
        Upload eBook
      </button>
    </div>
  );
};

export default UploadForm;
