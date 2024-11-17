// import React from 'react';
// import "../styles/dashboard.css";

// function VideoStream() {
//   return (
//     <div className='video-container'  style={{ display: 'flex', justifyContent: 'center',width: '50%'}}>
//       <img src="http://localhost:5000/video_feed" alt="Loading..." width="450"  />
//     </div>
//   );
// }

// export default VideoStream;
import React, { useEffect, useRef, useState } from "react";

const VideoStream = () => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [areas, setAreas] = useState([]); // Stores all drawn areas
  const [currentArea, setCurrentArea] = useState(null); // Temporarily stores the area being drawn
  const [selectedAreaType, setSelectedAreaType] = useState("working1"); // Tracks the current area type (working1, working2, or main)

  // Load areas from localStorage when the component mounts
  useEffect(() => {
    const savedAreas = JSON.parse(localStorage.getItem("areas")) || [];
    setAreas(savedAreas);
  }, []);

  // Save areas to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("areas", JSON.stringify(areas));
    draw(); // Ensure the canvas is updated when `areas` change
  }, [areas]);

  // Resize and redraw the canvas when the image loads or changes size
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;

    if (canvas && img) {
      const updateCanvasSize = () => {
        const { width, height } = img.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        draw(); // Redraw areas after resizing
      };

      updateCanvasSize(); // Initial size update
      window.addEventListener("resize", updateCanvasSize); // Handle window resize
      return () => {
        window.removeEventListener("resize", updateCanvasSize);
      };
    }
  }, [areas]); // Depend on `areas` to redraw after loading

  // Handle keyboard input for selecting area types
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "1") {
        setSelectedAreaType("working1");
      } else if (e.key === "2") {
        setSelectedAreaType("working2");
      } else if (e.key.toLowerCase() === "m") {
        setSelectedAreaType("main");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    setCurrentArea({
      x1: startX,
      y1: startY,
      x2: startX,
      y2: startY,
      type: selectedAreaType, // Add area type to the current area
    });
    setDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!drawing || !currentArea) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    setCurrentArea((prev) => ({
      ...prev,
      x2: endX,
      y2: endY,
    }));
  };

  const handleMouseUp = () => {
    if (currentArea) {
      setAreas((prev) => {
        // Remove any existing area of the same type before adding a new one
        return [
          ...prev.filter((area) => area.type !== currentArea.type),
          currentArea,
        ];
      });
      setCurrentArea(null);
    }
    setDrawing(false);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all saved areas
    areas.forEach((area) => {
      ctx.strokeStyle =
        area.type === "main"
          ? "blue"
          : area.type === "working1"
          ? "green"
          : "red"; // Different colors for different areas
      ctx.lineWidth = 2;
      ctx.strokeRect(
        area.x1,
        area.y1,
        area.x2 - area.x1,
        area.y2 - area.y1
      );
    });

    // Draw the area currently being drawn
    if (currentArea) {
      ctx.strokeStyle =
        currentArea.type === "main"
          ? "blue"
          : currentArea.type === "working1"
          ? "green"
          : "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        currentArea.x1,
        currentArea.y1,
        currentArea.x2 - currentArea.x1,
        currentArea.y2 - currentArea.y1
      );
    }
  };

  return (
    <div
      className="video-container"
      style={{ position: "relative", width: "50%" }}
    >
      <img
        ref={imgRef}
        src="http://localhost:5000/video_feed"
        alt="Video Stream"
        style={{
          width: "100%",
          display: "block",
        }}
        draggable="false" // Prevent dragging
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2, // Ensure canvas is on top of the image
          pointerEvents: "auto", // Enable interaction
          cursor: "crosshair",
          height: "100%",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        <p>Press 1: Select Working Area 1 (Green)</p>
        <p>Press 2: Select Working Area 2 (Red)</p>
        <p>Press M: Select Main Area (Blue)</p>
        <p>Current Selection: {selectedAreaType.toUpperCase()}</p>
        <button
  onClick={() => {
    fetch("http://localhost:5000/api/update-areas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ areas }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Areas updated:", data);
      })
      .catch((error) => {
        console.error("Error updating areas:", error);
      });
  }}
  style={{ marginTop: "10px", padding: "5px" }}
>
  Save Areas
</button>
      </div>
    </div>
  );
};

export default VideoStream;



