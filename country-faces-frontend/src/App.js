import React from 'react';
import './App.css';
import GameComponent from "./GameComponent";

function App() {
    const logos = [
        "logo_au.png",
        "logo_bn.png",
        "logo_fr.png",
        "logo_hk.png",
        "logo_pr.png",
        "logo_usa.png"
    ];
    const randomLogo = logos[Math.floor(Math.random() * logos.length)];
    return (
        <div className="App">
            <div>
                <img className="logo" src={randomLogo} alt="Country Faces" />
            </div>
            <GameComponent />
        </div>
    );
}

export default App;
