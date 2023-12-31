import Webcam from "react-webcam";
import { useRef, useState, useCallback } from "react";
import './webcam.scss';

const CustomWebcam = (props) => {
const webcamRef = useRef(null);
const [imgSrc, setImgSrc] = useState(null);
const [images, setImages] = useState([]);

const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();   
    // const imageBlob = dataURItoBlob(imageSrc);
    // setImages(prevImages => [...prevImages, imageBlob]);
    setImages(prevImages => [...prevImages, imageSrc]);

    setImgSrc(imageSrc);
  }, [webcamRef]);

const retake = () => {
    setImgSrc(null);
};

const videoConstraints = {
    facingMode: { exact: "environment" }
};



  return (
    <div className="container">
      {imgSrc ? (
            <img src={imgSrc} height="320" width="auto" alt="webcam" />
      ) : (
        <Webcam videoConstraints={videoConstraints} height={350} width={350} ref={webcamRef}  />
      )}
      <div className="btn-container">
        {images.length < 10 && <div onClick={imgSrc ? retake : capture} className="click">&#128247;</div>}
      </div>
      <div style={{marginTop: '16px'}}>{`${10-images.length} clicks left`}</div>
      <div className="done-btn">
        <button onClick={() => props.handlePhoto(images)}>selesai</button>
      </div>
    </div>
  );
};

export default CustomWebcam;