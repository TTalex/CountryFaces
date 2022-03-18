import requests
import json
import re
import reverse_geocoder as rg
import sqlite3


con = sqlite3.connect('data.db')
cur = con.cursor()

def fetchpage(page):
    flickr_api_key = ""
    response = requests.get(f"https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key={flickr_api_key}&tags=portrait&has_geo=true&extras=geo,url_c&per_page=250&page={page}&format=json")
    matches = re.match('^jsonFlickrApi\((.*)\)$', response.text)
    content = json.loads(matches[1])
    # print(content)
    photos = []
    latlons = []
    if content.get('stat') == 'ok':
        for photo in content['photos']['photo']:
            url = f"https://flickr.com/photos/{photo['owner']}/{photo['id']}"
            photo["url"] = url
            photos.append(photo)
            latlons.append((photo["latitude"], photo["longitude"]))

    locations = rg.search(latlons)
    for i in range(0, len(photos)):
        photo = photos[i]
        location = locations[i]
        try:
            print(photo["id"], photo["owner"], photo["latitude"], photo["longitude"], photo["url_c"], url, location['lat'])
        except KeyError as e:
            continue
        try:
            cur.execute("INSERT INTO Photos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (photo["id"], photo["owner"], photo["latitude"], photo["longitude"], photo["url_c"], photo["url"], location.get('name'), location.get('admin1'), location.get('admin2'), location.get('cc')))
        except sqlite3.IntegrityError as e:
            pass
for i in range(8, 30):
    fetchpage(i)
con.commit()
con.close()
