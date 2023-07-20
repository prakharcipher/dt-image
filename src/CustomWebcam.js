import Webcam from "react-webcam";
import { useRef, useState, useCallback } from "react";
import './webcam.scss';

// convert base64/URLEncoded data component to raw binary data held in a string
function dataURItoBlob(dataURI) {
  if(!dataURI){
    return;
  }
  
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
}

const CustomWebcam = (props) => {
const webcamRef = useRef(null);
const [imgSrc, setImgSrc] = useState(null);
const [images, setImages] = useState([]);

const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();   
    const imageBlob = dataURItoBlob(imageSrc);
    setImages(prevImages => [...prevImages, imageBlob]);

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