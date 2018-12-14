import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, box }) => {
    return (
        <div className="center ma ">
            <div className="absolute mt2">
                {imageUrl && <img id="input-image" src={imageUrl} alt="invalid" width="500px" height="auto" />}
                <div className="bounding-box" style={{ ...box }}></div>
            </div>
        </div>
    );
}

export default FaceRecognition;