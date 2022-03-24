import React, {useState, useEffect} from 'react';
import './GameComponent.css';
import FlagPhotoButton from './FlagPhotoButton';
import ScoreComponent from './ScoreComponent';
import Spinner from './Spinner';

interface Photo {
    id: string,
    owner: string,
    lat: number,
    lon: number,
    direct_url: string,
    url: string,
    city: string,
    admin1: string,
    admin2: string,
    country_code: string,
    flagged: number
}
interface CountryCodes {
    Country_Name_Fr: string,
    Continent_Code: string
}
export default function GameComponent(){
    const [params, setParams] = useState({
        photo: {} as Photo & CountryCodes,
        countryChoices: [] as string[]
    });
    type guessType = -1|0|1|2;
    const [guess, setGuess] = useState<guessType>(-1);
    const [round, setRound] = useState(1);
    const [imageIsLoaded, setImageIsLoaded] = useState(false);
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
    function handleCountrySelection(event:React.MouseEvent<HTMLButtonElement>) {
        // Only consider guess if nothing has been guessed yet
        if (guess === -1) {
            const target = event.target as HTMLButtonElement;
            setGuess(parseInt(target.value) as guessType);
            // Autocontinue ?
            // setTimeout(() => continueGame(), 1000)
        }
    }
    function handleImageLoaded() {
        setImageIsLoaded(true);
    }
    function continueGame() {
        setGuess(-1);
        setRound(prevRound => prevRound + 1);
        setParams({
            photo: {} as Photo & CountryCodes,
            countryChoices: [] as string[]
        });
        setImageIsLoaded(false);
    }
    let resultDiv : JSX.Element;
    if (params.countryChoices[guess] === params.photo.Country_Name_Fr) {
        resultDiv = <div>Bravo !</div>;
    } else {
        resultDiv = <div>Raté, c'était {params.photo.Country_Name_Fr}</div>;
    }
    return (
        <div>
            <ScoreComponent hasUserGuessed={guess > -1} isGuessCorrect={params.countryChoices[guess] === params.photo.Country_Name_Fr} />
            <div style={{display: imageIsLoaded ? "none" : "block"}}>
                <Spinner />
            </div>
            <div style={{display: imageIsLoaded ? "block" : "none"}}>
                {guess > -1
                    ? <a href={params.photo.url} target="_blank" rel="noreferrer">
                        <img className="mainPhoto" src={params.photo.direct_url} alt="random portrait" />
                    </a>
                    : <img className="mainPhoto" src={params.photo.direct_url} alt="random portrait" onLoad={handleImageLoaded} />
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
