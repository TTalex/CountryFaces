import React, {useState, useEffect} from 'react';
import './GameComponent.css';
import FlagPhotoButton from './FlagPhotoButton';
import ScoreComponent from './ScoreComponent';


export default function GameComponent(){
    const [params, setParams] = useState({
        photo: {},
        countryChoices: []
    });
    const [guess, setGuess] = useState(-1);
    const [round, setRound] = useState(1);
    useEffect(() => {
        fetch("http://" + window.location.hostname + ":8000/api/image")
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
        // Only consider guess if nothing has been guessed yet
        if (guess === -1) {
            setGuess(parseInt(event.target.value));
            // Autocontinue ?
            // setTimeout(() => continueGame(), 1000)
        }
    }
    function continueGame() {
        setGuess(-1);
        setRound(prevRound => prevRound + 1);
    }
    let resultDiv = "";
    if (params.countryChoices[guess] === params.photo.Country_Name_Fr) {
        resultDiv = <div>Bravo !</div>;
    } else {
        resultDiv = <div>Raté, c'était {params.photo.Country_Name_Fr}</div>;
    }
    return (
        <div>
            <ScoreComponent guess={guess} result={params.countryChoices[guess] === params.photo.Country_Name_Fr} />
            <div>
                {guess > -1
                    ? <a href={params.photo.url} target="_blank">
                        <img className="mainPhoto" src={params.photo.direct_url} alt="random portrait" />
                    </a>
                    : <img className="mainPhoto" src={params.photo.direct_url} alt="random portrait" />
                }
            </div>
            <div className="choicesContainer">
                <button className="btn btn-primary choiceBtn" onClick={handleCountrySelection} value="0">{params.countryChoices[0]}</button>
                <button className="btn btn-primary choiceBtn" onClick={handleCountrySelection} value="1">{params.countryChoices[1]}</button>
                <button className="btn btn-primary choiceBtn" onClick={handleCountrySelection} value="2">{params.countryChoices[2]}</button>
            </div>
            {guess > -1 &&
                <div>
                    <div style={{"margin": "10px"}}>
                        {resultDiv}
                    </div>
                    <div><button className="btn-lg btn-secondary" onClick={continueGame}>Continuer</button></div>
                    <div className="bottomBtn"><FlagPhotoButton photo={params.photo}/></div>
                </div>
            }
        </div>
    )
}
