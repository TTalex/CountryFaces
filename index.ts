import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import sqlite3 from 'sqlite3';

const app = express();
const db = new sqlite3.Database('data.db');

app.use(cors());
app.use(express.static(path.join('country-faces-frontend', 'build')));
app.use(bodyParser.json({limit: '50mb'}));

function getRandomElement<Type>(array:Type[]):Type {
    return array[Math.floor(Math.random() * array.length)];
}
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
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
function getAvailableCountryCodes() : Promise<string[]> {
    const EASY_MODE = true;
    let query = "";
    if (EASY_MODE) {
        // In easy mode, only play with countries with more than 5 million population
        query = "select distinct country_code from Photos" +
        " left join CountryCodes on country_code = Two_Letter_Country_Code " +
        " left join Pop2020 on LocID = Country_Number " +
        " where flagged != 1 and PopTotal > 5000";
    } else {
        query = "select distinct country_code from Photos where flagged != 1";
    }
    return new Promise(resolve => {
        db.all(query, (err: string, data: {country_code: string}[]) => {
            if (!err) {
                resolve(data.map(e => e.country_code))
            } else {
                resolve([]);
            }
        })
    });
}
function getAvailableOwners(countryCode:string) : Promise<string[]> {
    return new Promise(resolve => {
        db.all("select distinct owner from Photos where country_code = ? and flagged != 1", countryCode, (err: string, data: {owner: string}[]) => {
            if (!err) {
                resolve(data.map(e => e.owner))
            } else {
                resolve([]);
            }
        })
    });
}
function getRandomPhoto(countryCode: string, owner: string) : Promise<Photo & CountryCodes|null> {
    return new Promise(resolve => {
        db.get("select Photos.*, Country_Name_Fr, Continent_Code from Photos left join CountryCodes on country_code == Two_Letter_Country_Code where owner = ? and country_code = ? and flagged != 1 order by random() limit 1", [owner, countryCode], (err: string, data:Photo & CountryCodes) => {
            if (!err) {
                resolve(data)
            } else {
                resolve(null);
            }
        })
    });
}
function getRandomCountryChoices(continentCode: string, selectedCountryCode: string, availableCountryCodes: string[]) : Promise<string[]> {
    let availableCountryCodesString = availableCountryCodes.map(_ => "?").join(",");
    return new Promise(resolve => {
        db.all("select Country_Name_Fr from CountryCodes where Continent_Code == ? and Two_Letter_Country_Code != ? and Two_Letter_Country_Code in (" + availableCountryCodesString + ") order by random() limit 2", [continentCode, selectedCountryCode].concat(availableCountryCodes), (err:string, data:{Country_Name_Fr: string}[]) => {
            if (!err) {
                resolve(data.map(e => e.Country_Name_Fr))
            } else {
                resolve([]);
            }
        })
    });
}
app.get('/api/image', async (_, res) => {
    let availableCountryCodes = await getAvailableCountryCodes();
    let randomCountryCode = getRandomElement(availableCountryCodes);
    let availableOwners = await getAvailableOwners(randomCountryCode);
    let randomOwner = getRandomElement(availableOwners);
    let randomPhoto = await getRandomPhoto(randomCountryCode, randomOwner);
    if (randomPhoto) {
        let randomCountryChoices = await getRandomCountryChoices(randomPhoto.Continent_Code, randomCountryCode, availableCountryCodes);
        randomCountryChoices.push(randomPhoto.Country_Name_Fr);
        shuffleArray(randomCountryChoices);
        res.json({
            photo: randomPhoto,
            countryChoices: randomCountryChoices
        });
    } else {
        res.json({
            err: "No photo could be found"
        })
    }
});

function flagPhoto(photoId:string): Promise<string> {
    return new Promise(resolve => {
        db.run("update Photos set flagged = 1 where id = ?", photoId, (err:string) => {
            resolve(err);
        })
    });
}
app.delete('/api/image/:id', async (req, res) => {
    let error = await flagPhoto(req.params.id);
    res.json({
        error: error
    });
});

app.listen(8000, () => {
    console.log('listening on *:8000');
});
