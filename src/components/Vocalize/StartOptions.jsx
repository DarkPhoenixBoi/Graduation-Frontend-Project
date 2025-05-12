import React, { useState } from "react";
import PageSelector from "./PageSelector";
import LanguageSelector from "./LanguageSelector";
import styles from "./StartOptions.module.css";

const StartOptions = ({ onStart }) => {
  const [language, setLanguage] = useState("en");
  const [startPage, setStartPage] = useState(null);

  const handlePageSelect = (pageNum) => {
    setStartPage(pageNum);
    notifyChange(pageNum, language);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    notifyChange(startPage, lang);
  };

  const notifyChange = (page, lang) => {
    if (page && lang && onStart) {
      onStart(page, lang);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Start Options</h3>
      <LanguageSelector selected={language} onChange={handleLanguageChange} />
      <PageSelector onSelect={handlePageSelect} />
    </div>
  );
};

export default StartOptions;
