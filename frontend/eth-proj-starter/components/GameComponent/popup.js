import React, { useState } from 'react';
import styles from './popup.module.css'; 

const PopupMessage = ({ msg, setMsg }) => {
    const closePopup = () => {
      setMsg(""); // Clears the message, effectively closing the popup
    };
  
    if (!msg) {
      // If the message is empty, render nothing
      return null;
    }
  
    return (
      <div className={styles.popup_label}>
             {msg}
        <button className={styles.close} onClick={closePopup}>
          ×
        </button>
      </div>
    );
  };
  
  export default PopupMessage;

