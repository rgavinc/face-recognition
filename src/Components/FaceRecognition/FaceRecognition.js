import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, boxes = [] }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img id="inputimage" alt="" src={imageUrl} width="500px" heigh="auto" />
        {boxes.map(box => (
          <div
            key={Object.values(box).join()}
            className="bounding-box"
            style={{
              ...box
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
