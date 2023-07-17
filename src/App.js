import './App.scss';
import logo from './logo.png';
import avatar from './avatar.png';
import plus from './plus.png';
import CustomWebcam from './CustomWebcam';
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
    setShow('loader');
    setTimeout(() => {
      handleSuccess();
    }, 3000);
  }

  function handleSuccess() {
    setShow('success');
    setTimeout(() => {
      setShow('home');
    }, 2000);
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
        <CustomWebcam handlePhoto={() => setShow('crop')} />
      </div>}

      {show === 'crop' && <div className='crop-container'>
        <div className='label'>Select Crop</div>
        <div className='crop'>
          <div onClick={() => highlightColor('chili')} className={selectedCrop === 'chili' ? 'highlight' : 'crop1'}>Chili</div>
        </div>
        <div className='crop'>
          <div onClick={() => highlightColor('rice')} className={selectedCrop === 'rice' ? 'highlight' : 'crop2'}>Rice</div>
        </div>
        <div className='crop'>
          <div onClick={() => highlightColor('corn')} className={selectedCrop === 'corn' ? 'highlight' : 'crop3'}>Corn</div>
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
              <div onClick={() => highlightPest('pest1')} className={selectedPest.includes('pest1') ? 'highlight' : 'pest1'}>Pest1</div>
              <div onClick={() => highlightPest('pest2')} className={selectedPest.includes('pest2') ? 'highlight' : 'pest2'}>Pest2</div>
              <div onClick={() => highlightPest('pest3')} className={selectedPest.includes('pest3') ? 'highlight' : 'pest3'}>Pest3</div>
              <div onClick={() => highlightPest('pest4')} className={selectedPest.includes('pest4') ? 'highlight' : 'pest4'}>Pest4</div>
              <div onClick={() => highlightPest('pest5')} className={selectedPest.includes('pest5') ? 'highlight' : 'pest5'}>Pest5</div>
              <div className='custom-pest'>
                <input placeholder="Masukkan nama hama" />
              </div>
            </div>
          </div>}
          {selectedProblem === 'diseases' && <div className='diseases'>
            <div className='disease'>
              <div onClick={() => highlightDisease('disease1')} className={selectedDisease.includes('disease1') ? 'highlight' : 'disease1'}>Disease1</div>
              <div onClick={() => highlightDisease('disease2')} className={selectedDisease.includes('disease2') ? 'highlight' : 'disease2'}>Disease2</div>
              <div onClick={() => highlightDisease('disease3')} className={selectedDisease.includes('disease3') ? 'highlight' : 'disease3'}>disease3</div>
              <div onClick={() => highlightDisease('disease4')} className={selectedDisease.includes('disease4') ? 'highlight' : 'disease4'}>Disease4</div>
              <div onClick={() => highlightDisease('disease5')} className={selectedDisease.includes('disease5') ? 'highlight' : 'disease5'}>Disease5</div>
              <div className='custom-disease'>
                <input placeholder="Masukkan nama penyakit" />
              </div>
            </div>
          </div>}
          {selectedProblem === 'deficiencies' && <div className='deficiencies'>
            <div className='deficiency'>
              <div onClick={() => highlightDeficiency('deficiency1')} className={selectedDeficiency.includes('deficiency1') ? 'highlight' : 'deficiency1'}>Deficiency1</div>
              <div onClick={() => highlightDeficiency('deficiency2')} className={selectedDeficiency.includes('deficiency2') ? 'highlight' : 'deficiency2'}>Deficiency2</div>
              <div onClick={() => highlightDeficiency('deficiency3')} className={selectedDeficiency.includes('deficiency3') ? 'highlight' : 'deficiency3'}>Deficiency3</div>
              <div onClick={() => highlightDeficiency('deficiency4')} className={selectedDeficiency.includes('deficiency4') ? 'highlight' : 'deficiency4'}>Deficiency4</div>
              <div onClick={() => highlightDeficiency('deficiency5')} className={selectedDeficiency.includes('deficiency5') ? 'highlight' : 'deficiency5'}>Deficiency5</div>
              <div className='custom-deficiency'>
                <input placeholder="Masukkan nama kekurangan" />
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
