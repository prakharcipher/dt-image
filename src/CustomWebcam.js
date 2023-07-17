import Webcam from "react-webcam";
import { useRef, useState, useCallback } from "react";
import './webcam.scss';

const CustomWebcam = (props) => {

const webcamRef = useRef(null);
const [imgSrc, setImgSrc] = useState(null);

const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
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
        <div style={{height: '354px', width: '350px', textAlign: 'center'}}>
            <img src={imgSrc} height="320" width="220" alt="webcam" style={{paddingTop: '12px', width: '350px'}} />
        </div>  
      ) : (
        <Webcam videoConstraints={videoConstraints} height={350} width={350} ref={webcamRef}  />
      )}
      <div className="btn-container">
        {/* <div onClick={retake} className="more">+</div> */}
        <div onClick={imgSrc ? retake : capture} className="click">&#128247;</div>
      </div>
      <div className="done-btn">
        <button onClick={props.handlePhoto}>selesai</button>
      </div>
    </div>
  );
};

export default CustomWebcam;