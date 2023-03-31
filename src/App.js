import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './App.css';

import React, {useState , useEffect} from 'react';

import axios from 'axios';

let result = []




function App () {
    const [datas, setDatas] = useState([]);
    const [ star, setStar] = useState(0);
    const [parcent, setParcent] = useState(0);
    const [last, setLast] = useState(false);
    let addParcent = parcent * 10;
    
    

    const next = () => {
      setStar(prev => prev + 1);
    };

    const prev = () => {
      setStar(prev => prev - 1);
      backParcent(star);
    };

    const myData = async () => {
      const newData = await axios.get("http://localhost:5000/data")
      setDatas(newData.data)
    }

    useEffect(() => {
      myData();
    }, []);

    const back = (e) => {
      e.preventDefault();
      prev();
      if (datas[star].id === 1) {
        next();
      }
    }

    const handle = (e) => {
      e.preventDefault();
      if (star !== datas.length - 1 ) {

        next();
        check(star)
      } else {
        check(star);
        setLast(true);
        
      }
    }

    const check = (star) => {
      if (datas[star]?.answer === result[star]?.ans) {
        
        setParcent(parcent + 1);
      } 
    }

    const backParcent = (star) => {
      if (datas[star-1]?.answer === result[star-1]?.ans) {
        
        setParcent(parcent - 1);
      }
    }

    
    const addAnswer = (e, star, id) => {
      result[star] = {id: id, ans: e.target.value};
    }

    const again = () => {
      setStar(0);
      result = [];
      setParcent(0);
      setLast(false);

    }

    return (
      <div className='container'>
        <form onSubmit={handle} className='main'>

              <span className='span'>{star + 1} / 10</span>
              <div className='title'>
                <h4>{datas[star]?.title}</h4>
              </div>
              
              {
                datas[star]?.cate.map(cates => (
                <label key={cates} className='answer'>
                  <input type='radio' name={datas[star].title} value={cates} onChange= {e => addAnswer(e,star, datas[star].id) } required/>
                  {cates}
                </label>
                ))
              }
          

          <div className='submit'>
            { star !== 0 && <button className='prev' onClick={e => back(e)}>Prev Question</button>}
            <button className='next' type="submit">{star <   (datas.length -1) ? 'Next Question' : 'Submit'}</button>
          </div>
          
        </form>
        {last && 
            <div className='last App'>
              <div className='inner'>

              <h3>
                {parcent < 5 && 'Bad'}
                {parcent >= 5 && 'Good'}
              </h3>

              <h4 className='last-result'>Your Answer</h4>
              
              <div style={{width: 100, height: 100 }}>
                <h3 ><CircularProgressbar value={addParcent} text={`${addParcent}%` } styles={buildStyles({pathColor: `rgba(255, 136, 136, ${addParcent / 100})`,textColor: '#f88', trailColor: '#d6d6d6',backgroundColor: '#3e98c7'})} /></h3>
              </div>
              <button className='again' onClick={() => again()}>Play Again</button>
              </div>
            </div>
        }
      </div>
        
      )
}

export default App;
