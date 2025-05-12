import React from "react";
import styles from "./LanguageSelector.module.css";

const LanguageSelector = ({ selected, onChange }) => {
  return (
    <div className={styles.container}>
      <label htmlFor="language" className={styles.label}>
        Select Language:
      </label>
      <select
        id="language"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className={styles.select}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="ar">Arabic</option>
        <option value="zh">Chinese</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
