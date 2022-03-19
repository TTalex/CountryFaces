# CountryFaces
![CountryFaces](country-faces-frontend/public/logo_fr.png)

Web based game where one has to guess the country of origin of a photographed person.

Built on nodejs and React.

**data.db** is a database containing portrait pictures and their geolocation extracted using the Flickr API.

| Column Name    | type        | Description                             |
| -------------- | ----------- | --------------------------------------- |
| `id`           | TEXT UNIQUE | Unique Id of the photo                  |
| `owner`        | TEXT        | Id of the photo owner                   |
| `lat`          | INTEGER     | Latitude                                |
| `lon`          | INTEGER     | Longitude                               |
| `direct_url`   | TEXT        | Direct photo url, can be used in `<img>`|
| `url`          | TEXT        | Flickr photo url                        |
| `city`         | TEXT        | Name of closest city to lat lon values  |
| `admin1`       | TEXT        | Name of country of the above city       |
| `admin2`       | TEXT        | Name of region of the above city        |
| `country_code` | TEXT        | Two letters country code                |
| `flagged`      | INTEGER     | 1 if not a portrait or incorrect geo    |

## Installation
Developped with nodejs>=14.16.1
```
# Install create react app deps (only needed to dev/build the frontend)
cd country-faces-frontend
npm install

# Install backend deps
cd ../
npm install
```

## Running
```
# Build frontend (if needed)
cd country-faces-frontend
npm build

# Start backend
cd ../
node index.js
```
