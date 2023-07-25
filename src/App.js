import './App.scss';
import logo from './logo.png';
import avatar from './avatar.png';
import plus from './plus.png';
import CustomWebcam from './CustomWebcam';
import axios from 'axios';
import { cropData } from './cropData';
import { SpinnerCircular } from 'spinners-react';
import success from './success.png';
import { useEffect, useState } from 'react';

function App() {

  const [selectedCrop, setCrop] = useState('');
  const [selectedPest, setPest] = useState([]);
  const [selectedDisease, setDisease] = useState([]);
  const [selectedDeficiency, setDeficiency] = useState([]);
  const [selectedProblem, setProblem] = useState('pests');
  const [name, setName] = useState('');
  const [show, setShow] = useState('');
  const [formData, setFormData] = useState({});
  const [customPest, setCustomPest] = useState('');
  const [customDisease, setCustomDisease] = useState('');
  const [customDeficiency, setCustomDeficiency] = useState('');

  function highlightColor(crop) {
    setCrop(crop);
  }

  function resetStates() {
    setCrop('');
    setPest([]);
    setDisease([]);
    setDeficiency([]);
    setProblem('pests');
    setFormData({});
    setCustomPest('');
    setCustomDisease('');
    setCustomDeficiency('');
  }

  useEffect(() => {
    if(localStorage.getItem('agroName') && localStorage.getItem('agroName') !== '') {
      setShow('home')
    } else {
      setShow('name')
    }
  }, [])

  function highlightPest(pest) {
    const pestCopy = [...selectedPest];
    const index = pestCopy.indexOf(pest);
    if (index > -1) {
      pestCopy.splice(index, 1);
    } else {
      pestCopy.push(pest);
    }
    setPest(pestCopy);
  }

  function removeImage(image) {
    const cropImagesCopy = [ ...formData['crop_images'] ];
    const index = cropImagesCopy.indexOf(image);
    if(index > -1) {
      cropImagesCopy.splice(index, 1);
    }
    const formDataCopy = { ...formData };
    formDataCopy['crop_images'] = cropImagesCopy;
    setFormData(formDataCopy);
  }

  function highlightDisease(disease) {
    const diseaseCopy = [...selectedDisease];
    const index = diseaseCopy.indexOf(disease);
    if (index > -1) {
      diseaseCopy.splice(index, 1);
    } else {
      diseaseCopy.push(disease);
    }
    setDisease(diseaseCopy);
  }

  function highlightDeficiency(deficiency) {
    const deficiencyCopy = [...selectedDeficiency];
    const index = deficiencyCopy.indexOf(deficiency);
    if (index > -1) {
      deficiencyCopy.splice(index, 1);
    } else {
      deficiencyCopy.push(deficiency);
    }
    setDeficiency(deficiencyCopy);
  }

  function handleTabClick(problem) {
    setProblem(problem);
    if(problem === 'pests') {
      setDisease([]);
      setDeficiency([]);
    } 

    if(problem === 'diseases') {
      setPest([]);
      setDeficiency([]);
    }

    if(problem === 'deficiencies') {
      setPest([]);
      setDisease([]);
    }
  }

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleName() {
    localStorage.setItem("agroName", name);
    setShow('home');
  }

  function handleLoader() {
    const data = { ...formData };

    if(selectedPest.length > 0) {
      data['pests'] = selectedPest;
      if(customPest) {
        data['pests'].push(customPest);
      }
      data['diseases'] = [];
      data['deficiencies'] = [];
    }

    if(selectedDisease.length > 0) {
      data['diseases'] = selectedDisease;
      if(customDisease) {
        data['diseases'].push(customDisease);
      }
      data['pests'] = [];
      data['deficiencies'] = [];
    }
    
    if(selectedDeficiency.length > 0) {
      data['deficiencies'] = selectedDeficiency;
      if(customDeficiency) {
        data['deficiencies'].push(customDeficiency);
      }
      data['pests'] = [];
      data['diseases'] = [];
      
    }

    setFormData(data);

    setShow('loader');

    const formBody = new FormData();
    formBody.append('crop_name', data.crop_name);
    formBody.append('agronomist_email', localStorage.getItem('agroName'));
    data.pests.forEach((pest, index) => {
      formBody.append(`pests[]`, pest);
    });
    data.diseases.forEach((disease, index) => {
      formBody.append(`diseases[]`, disease);
    });
    data.deficiencies.forEach((deficiency, index) => {
      formBody.append(`deficiencies[]`, deficiency);
    });
    data.crop_images.forEach((blob, index) => {
        formBody.append(`crop_images`, blob, `image_${index}.jpg`);
    });

    axios.post('https://dev-api.dayatani.id/agronomist/api/crop-images', formBody, {
      headers: {
          'Content-Type': 'multipart/form-data', // Important for formData
      }
    })
    .then((res) => {
      handleSuccess();
      resetStates();
      console.log("Response = ", res);
    })
  }

  function handleSuccess() {
    setShow('success');
    setTimeout(() => {
      setShow('home');
    }, 2000);
  }

  function handlePhoto(images) {
    const data = { ...formData };
    data['crop_images'] = images;
    setFormData(data);
    setShow('review');
  }

  function handleCrop(crop) {
    highlightColor(crop);
    const data = { ...formData };
    data['crop_name'] = crop;
    setFormData(data);
  }

  function handlePestChange(e) {
    setCustomPest(e.target.value);
  }

  function handleDiseaseChange(e) {
    setCustomDisease(e.target.value);
  }

  function handleDeficiencyChange(e) {
    setCustomDeficiency(e.target.value);
  }

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

  function handleShowCrop() {
    const imagesCopy = [ ...formData['crop_images'] ];
    const blobImages = [];
    imagesCopy.forEach((image) => {
      blobImages.push(dataURItoBlob(image));
    })
    const formDataCopy = { ...formData };
    formDataCopy['crop_images'] = blobImages;
    setFormData(formDataCopy);
    setShow('crop');
  }


  return (
    <div className="App">
      <div className='header'>
          <img src={logo} alt="logo" width="130px" />
        </div>
      {show === 'name' && <div className='name-comp'>
        <div className='avatar'>
          <img src={avatar} alt="avatar" width="180px" />
        </div>
        <div className='name'>
          <input placeholder="Masukkan Email Anda" onChange={handleChange} />
        </div>
        <div className='btn-cta'>
          <button onClick={handleName}>mulai</button>
        </div>
      </div>}

      {show === 'home' && <div className='home-comp'>
        <div onClick={() => setShow('webcam')} className='plus'>
          <img src={plus} alt="plus" width="180px" />
        </div>
        <div onClick={() => setShow('webcam')} className='label-text'>Klik gambar</div>
      </div>}

      {show === 'webcam' && <div className='webcam'>
        <CustomWebcam handlePhoto={handlePhoto} />
      </div>}

      {show === 'review' && <div className='review'>
        <div className='label' style={{fontWeight: '600', fontSize: '20px', marginTop: '20px', textAlign: 'center'}}>Ulasan gambar</div>
        <div>
          {formData['crop_images'].map((image) => {
            return (
              <div key={image} style={{textAlign: 'center'}}>
                <img alt="preview" src={image} height="350" width="auto" style={{marginTop: '16px'}} />
                <div>
                  <button onClick={() => removeImage(image)} style={{width: '200px', padding: '8px', backgroundColor: 'red', color: 'white', borderRadius: '8px', border: 'none', fontSize: '18px'}}>Remove X</button>
                </div>
              </div>
            )
          })}
        </div>
        <div className='next-cta'>
          <button onClick={handleShowCrop}>selanjutnya</button>
        </div>
      </div>}

      {show === 'crop' && <div className='crop-container'>
        <div className='label'>Select Crop</div>
        <div className='crop'>
          <div onClick={() => handleCrop('chili')} className={selectedCrop === 'chili' ? 'highlight' : 'crop1'}>Chili</div>
        </div>
        <div className='crop'>
          <div onClick={() => handleCrop('rice')} className={selectedCrop === 'rice' ? 'highlight' : 'crop2'}>Rice</div>
        </div>
        <div className='crop'>
          <div onClick={() => handleCrop('corn')} className={selectedCrop === 'corn' ? 'highlight' : 'crop3'}>Corn</div>
        </div>
        <div className='crop'>
          <div onClick={() => handleCrop('cabbage')} className={selectedCrop === 'cabbage' ? 'highlight' : 'crop4'}>Cabbage</div>
        </div>
        <div className='crop'>
          <div onClick={() => handleCrop('tomato')} className={selectedCrop === 'tomato' ? 'highlight' : 'crop5'}>Tomato</div>
        </div>
        <div className='crop'>
          <div onClick={() => handleCrop('shallot')} className={selectedCrop === 'shallot' ? 'highlight' : 'crop7'}>Shallots</div>
        </div>
        <div className='next-cta'>
          <button onClick={() => setShow('problem')}>selanjutnya</button>
        </div>
      </div>}
      
     {show === 'problem' && <div className='problem-container'>
        <div className='label'>Pilih Masalah</div>
        <div className='tabs-container'>
          <div className='tabs'>
            <div onClick={() => handleTabClick('pests')} className={selectedProblem === 'pests' ? 'pests highlight' : 'pests'}>Hama</div>
            <div onClick={() => handleTabClick('diseases')} className={selectedProblem === 'diseases' ? 'highlight' : 'diseases'}>Penyakit</div>
            <div onClick={() => handleTabClick('deficiencies')} className={selectedProblem === 'deficiencies' ? 'deficiency highlight' : 'deficiency'}>Kekurangan</div>
          </div>
        </div>
        <div className='problems'>
          {selectedProblem === 'pests' && <div className='pests'>
            <div className='pest'>
              {cropData[selectedCrop].pests.map(pest => 
                  <div onClick={() => highlightPest(pest)} className={selectedPest.includes(pest) ? 'highlight' : 'pest1'}>{pest}</div>
                )}
              <div className='custom-pest'>
                <input placeholder="Masukkan nama hama" onChange={handlePestChange} />
              </div>
            </div>
          </div>}
          {selectedProblem === 'diseases' && <div className='diseases'>
            <div className='disease'>
            {cropData[selectedCrop].diseases.map(disease => 
                  <div onClick={() => highlightDisease(disease)} className={selectedDisease.includes(disease) ? 'highlight' : 'disease1'}>{disease}</div>
                )}
              <div className='custom-disease'>
                <input placeholder="Masukkan nama penyakit" onChange={handleDiseaseChange} />
              </div>
            </div>
          </div>}
          {selectedProblem === 'deficiencies' && <div className='deficiencies'>
            <div className='deficiency'>
            {cropData[selectedCrop].deficiencies.map(deficiency => 
                  <div onClick={() => highlightDeficiency(deficiency)} className={selectedDeficiency.includes(deficiency) ? 'highlight' : 'deficiency1'}>{deficiency}</div>
                )}              
              <div className='custom-deficiency'>
                <input placeholder="Masukkan nama kekurangan" onChange={handleDeficiencyChange} />
              </div>
            </div>
          </div>}
          <div className='next-cta'>
            <button onClick={handleLoader}>unggah</button>
          </div>
        </div>
      </div>}
      {show === 'loader' && <div className='upload-loader'>
        <div className='loader'>
          <SpinnerCircular size={80} сolor="#CCEE24" secondaryColor="#01371D" />
          <div className='label'>Uploading Images</div>
        </div>
      </div>}

      {show === 'success' && <div className='success-container'>
        <div className='success'>
          <img src={success} width="100" alt="success" />
          <div className='label'>Images Uploaded Successfully</div>
        </div>
      </div>}
    </div>
  );
}

export default App;
