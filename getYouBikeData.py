import requests

url = "https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json"

def getYouBikeData():
    # get ubike data from ubike json
    try:
        res = requests.get(url)
    except requests.ConnectionError:
       return "Connection Error"  
    data = res.json()
    global ubike_data
    ubike_data = data["retVal"]

    return ubike_data