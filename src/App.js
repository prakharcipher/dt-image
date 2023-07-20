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

    const reqBody = { ...data };
    reqBody['agronomist_email'] = localStorage.getItem('agroName');

    axios.post('https://dev-api.dayatani.id/agronomist/api/crop-images', reqBody)
    .then((res) => {
      console.log("Response = ", res);
    })

    setShow('loader');
    // setTimeout(() => {
    //   handleSuccess();
    // }, 3000);
  }

  function handleSuccess() {
    setShow('success');
    setTimeout(() => {
      setShow('home');
    }, 2000);
  }

  function handlePhoto(images) {
    setShow('crop');
    const data = { ...formData };
    data['crop_images'] = images;
    setFormData(data);
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

  console.log("Form Data = ", cropData)

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
          <input placeholder="Masukkan nama Anda" onChange={handleChange} />
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
