import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const [params, setParams] = useState({
        photo: {},
        countryChoices: []
    });
    const [guess, setGuess] = useState(-1);
    const [round, setRound] = useState(1);
    useEffect(() => {
        fetch("http://localhost:8000/api/image")
        .then(res => res.json())
        .then(
            (result) => {
                console.log('result', result);
                setParams(result);
            },
            (error) => {
                console.log("fetch api error", error);
            }
        )
    }, [round]);
    function handleCountrySelection(event) {
        const {name, value} = event.target;
        setGuess(parseInt(value));
    }
    function continueGame() {
        setGuess(-1);
        setRound(prevRound => prevRound + 1);
    }
    return (
        <div className="App">
            <div>
                <img src={params.photo.direct_url} alt="random picture" />
            </div>
            <div style={{display: "inline-block"}}>
                <button className="btn btn-primary" onClick={handleCountrySelection} value="0">{params.countryChoices[0]}</button>
                <button className="btn btn-primary" onClick={handleCountrySelection} value="1">{params.countryChoices[1]}</button>
                <button className="btn btn-primary" onClick={handleCountrySelection} value="2">{params.countryChoices[2]}</button>
            </div>
            {guess > -1 && (params.countryChoices[guess] == params.photo.Country_Name_Fr
                ? <div>Bravo !</div>
                : <div>Raté, c'était {params.photo.Country_Name_Fr}</div>)
            }
            {guess > -1 && <div><button className="btn btn-secondary" onClick={continueGame}>Continuer</button></div>}
        </div>
    );
}

export default App;
