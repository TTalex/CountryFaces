# Proof of concept of the game, written in python3 for the unix terminal
import sqlite3
import random


con = sqlite3.connect('../data.db')
cur = con.cursor()

available_country_codes = [c[0] for c in cur.execute("select distinct country_code from Photos where flagged != 1").fetchall()]
available_country_codes_str = ','.join([f"'{c}'" for c in available_country_codes])
while True:
    random_country_code = random.choice(available_country_codes)
    available_owners = [c[0] for c in cur.execute(f"select distinct owner from Photos where country_code = '{random_country_code}' and flagged != 1").fetchall()]
    random_owner = random.choice(available_owners)
    random_photo = cur.execute(f"select Photos.*, Country_Name_Fr, Continent_Code from Photos left join CountryCodes on country_code == Two_Letter_Country_Code where owner = '{random_owner}' and country_code = '{random_country_code}' and flagged != 1 order by random() limit 1").fetchone()

    _, _, lat, lon, direct_url, url, city, _, _, cc, country, continent_code, flagged = random_photo

    random_choices = [c[0] for c in cur.execute(f"select Country_Name_Fr from CountryCodes where Continent_Code == '{continent_code}' and Two_Letter_Country_Code != '{cc}' and Two_Letter_Country_Code in ({available_country_codes_str}) order by random() limit 2").fetchall()]
    random_choices.append(country)
    random.shuffle(random_choices)
    print(direct_url, url)
    random_choices_str = "\033[1m" + " | ".join([f"{i+1} {x}" for i,x in enumerate(random_choices)]) + "\033[0m\n"
    a=input(random_choices_str)
    try:
        chosen_country = random_choices[int(a)-1]
    except Exception as e:
        chosen_country = ""
    if chosen_country == country:
        result = "\033[1m\033[32mOuais !"
    else:
        result = "\033[1m\033[31mNon :("
    print(f"{result} {city} {country}\033[0m")
    print("")
