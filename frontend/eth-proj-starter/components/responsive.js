import React, { useState, useEffect } from "react";

const ResponsiveWarning = ({ minWidth = 768 }) => {
  const [isScreenSmall, setIsScreenSmall] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerWidth < minWidth);
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [minWidth]);

  return isScreenSmall ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        color: "white",
        fontSize: "1.5rem",
        zIndex: 9999,
        textAlign: "center",
      }}
    >
      Please use a bigger screen.
    </div>
  ) : null;
};

export default ResponsiveWarning;
