const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');
const sqlite3 = require('sqlite3');

const app = express();
const server = http.createServer(app);
const db = new sqlite3.Database('data.db');

app.use(cors());
app.use(express.static(path.join(__dirname, 'country-faces-frontend', 'build')));
app.use(bodyParser.json({limit: '50mb'}));

let availableCountryCodes = "";
let availableCountryCodesString = "";
db.all("select distinct country_code from Photos", (err, data) => {
    if (!err) {
        availableCountryCodes = data.map(e => e.country_code);
        availableCountryCodesString = availableCountryCodes.map(cc => "?").join(",");
    }
})

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function getAvailableOwners(countryCode) {
    return new Promise(resolve => {
        db.all("select distinct owner from Photos where country_code = ?", countryCode, (err, data) => {
            if (!err) {
                resolve(data.map(e => e.owner))
            } else {
                resolve(null);
            }
        })
    });
}
function getRandomPhoto(countryCode, owner) {
    return new Promise(resolve => {
        db.get("select Photos.*, Country_Name_Fr, Continent_Code from Photos left join CountryCodes on country_code == Two_Letter_Country_Code where owner = ? and country_code = ? order by random() limit 1", [owner, countryCode], (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                resolve(null);
            }
        })
    });
}
function getRandomCountryChoices(continentCode, selectedCountryCode) {
    return new Promise(resolve => {
        db.all("select Country_Name_Fr from CountryCodes where Continent_Code == ? and Two_Letter_Country_Code != ? and Two_Letter_Country_Code in (" + availableCountryCodesString + ") order by random() limit 2", [continentCode, selectedCountryCode].concat(availableCountryCodes), (err, data) => {
            if (!err) {
                resolve(data.map(e => e.Country_Name_Fr))
            } else {
                resolve(null);
            }
        })
    });
}
app.get('/api/image', async (req, res) => {
    let randomCountryCode = getRandomElement(availableCountryCodes);
    let availableOwners = await getAvailableOwners(randomCountryCode);
    let randomOwner = getRandomElement(availableOwners);
    let randomPhoto = await getRandomPhoto(randomCountryCode, randomOwner);
    let randomCountryChoices = await getRandomCountryChoices(randomPhoto.Continent_Code, randomCountryCode);
    randomCountryChoices.push(randomPhoto.Country_Name_Fr);
    shuffleArray(randomCountryChoices);
    res.json({
        photo: randomPhoto,
        countryChoices: randomCountryChoices
    });
});

server.listen(8000, () => {
    console.log('listening on *:8000');
});