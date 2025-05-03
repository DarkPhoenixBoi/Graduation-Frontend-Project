import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiZoomOut,
  FiMaximize,
} from "react-icons/fi";
import styles from "./BookReader.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function BookReader({ fileUrl, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5);
  const containerRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  const handleItemClick = ({ pageNumber }) => setPageNumber(pageNumber);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));

  const fitToWidth = () => {
    const width = containerRef.current?.offsetWidth || 600;
    const targetScale = width / 800;
    setScale(Math.max(Math.min(targetScale, 3), 0.5));
  };

  useEffect(() => {
    fitToWidth();
  }, []);

  return (
    <div className={styles.readerOverlay}>
      <div className={styles.readerBox}>
        <div className={styles.toolbar}>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX size={20} />
          </button>

          <div className={styles.navigation}>
            <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
              <FiChevronLeft size={20} />
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
              <FiChevronRight size={20} />
            </button>
          </div>

          <div className={styles.zoomControls}>
            <button onClick={zoomOut}>
              <FiZoomOut size={20} />
            </button>
            <button onClick={fitToWidth}>
              <FiMaximize size={20} />
            </button>
            <button onClick={zoomIn}>
              <FiZoomIn size={20} />
            </button>
          </div>
        </div>

        <div className={styles.readerContent} ref={containerRef}>
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onItemClick={handleItemClick}
          >
            <Page pageNumber={pageNumber} scale={scale} />
          </Document>
        </div>
      </div>
    </div>
  );
}

export default BookReader;
