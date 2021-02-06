# Taipei_Find_YouBike_Website
A personalized website which helps you look for the nearest YouBike Station

### Usage
First, please change "YourGoogleMapKey" in home.html to your google map api key.\
Then, you can enter commands below to execute:
```
$ pip install -r requirements.txt
$ python app.py
```
( If you want to deploy this website on Heroku,\
please remember to change the host in app.py from 127.0.0.1 to 0.0.0.0 )

### Files
- app.py: The flask server source file
- getYouBikeData.py: Get YouBike data from open data
- Procfile: For Heroku deployment purpose
- requirements.txt: All packages needed in this project
- ./templates/* .:  All Jinja template files
- ./static/* .: Static frontend sources including the .js file, the .css file, pictures

### Brief Introduction
Taipei Find YouBike Website can help people look for the nearest YouBike Station. Besides, it'll show some information such as the number of bikes, the number of empty spaces. Moreover, people can add YouBike Stations they frequently use to the page so that they can see information of those stations immediately. This is a convenient and personalized website which tends to make people everyday-life much more easier.

### Some Screenshots of the website
![Imgur](https://i.imgur.com/PbyElEA.png)
\
\
![Imgur](https://i.imgur.com/uljyVP2.png)
\
\
![Imgur](https://i.imgur.com/lNaM5Mh.png)
\
\
![Imgur](https://i.imgur.com/dEY8eDC.png)
