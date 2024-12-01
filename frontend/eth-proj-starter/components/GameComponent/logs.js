import React, { useEffect, useState } from "react";
import styles from "./logs.module.css";

const Logs = ({ currplayerid }) => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [showMyEvents, setShowMyEvents] = useState(false);

  // Fetch logs on component mount
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:3002/logs");
        if (!response.ok) {
          throw new Error("Failed to fetch logs");
        }
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  // Filter logs whenever currplayerid or showMyEvents changes
  useEffect(() => {
    if (showMyEvents) {
      const myLogs = logs.filter((log) =>
        log.playerid.includes(currplayerid.toString())
      );
      setFilteredLogs(myLogs);
    } else {
      setFilteredLogs(logs);
    }
  }, [currplayerid, showMyEvents, logs]);

  // Toggle between "Show All Events" and "Show My Events"
  const toggleFilter = () => {
    setShowMyEvents((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Game Logs</h1>
      <button className={styles.toggleButton} onClick={toggleFilter}>
        {showMyEvents ? "Show All Events" : `Filter For Player ${currplayerid}`}
      </button>
      <ul className={styles.logsList}>
        {filteredLogs.map((log, index) => (
          <li key={index} className={styles.logItem}>
            {log.string}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Logs;
