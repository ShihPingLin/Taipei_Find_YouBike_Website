from flask import Flask, render_template
from getYouBikeData import getYouBikeData
import json

app = Flask(__name__)
# turn off the browser cache
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0

@app.route("/")
def home_page():
    ubike_data = getYouBikeData()

    return render_template(
        "home.html",
        ubike_data = ubike_data
    )

@app.route('/favorite')
def favorite_station_page():
    ubike_data = getYouBikeData()
    
    return render_template(
       "favorite.html",
       ubike_data = json.dumps(ubike_data)
    )

@app.route('/favorite/edit')
def favorite_station_edit_page():
    ubike_data = getYouBikeData()
    ubike_data_area = {}
    for i in ubike_data:
        if ubike_data[i]['sarea'] in ubike_data_area:
            ubike_data_area[ubike_data[i]['sarea']].append(i)
        else:
            ubike_data_area[ubike_data[i]['sarea']] = [i]

    return render_template(
       "favorite-edit.html",
       ubike_data_area = ubike_data_area,
       ubike_data = ubike_data
    )

@app.route('/instruction')
def instruction_page():
    return render_template(
       "instruction.html"
    )

import os
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    # 應用程式開始運行
    app.run(debug=True, port=port, host="127.0.0.1")