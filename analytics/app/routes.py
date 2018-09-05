from app import app
from flask import request, jsonify
import json
import geohash
#VALUE_RENT_INT_STUDENTS = 'rent_int_su'
PRESET = "basic-preset" #need to clarify

with open('app\config.json') as f:
    content =f.read()
    data =json.loads( content  )

# load default_preference from JSON file    
default_preference = data["default"]

@app.route('/')
@app.route('/index')
def index():
    return "Welcome to Analytics Server"

@app.route('/api/chat/messages', methods=('POST',))
def messages():
    message = request.get_json()
    # message.data.value, message.data.type
    if message and message.get("message").get("data").get("type") == PRESET:
        if message.get("message").get("data").get("value") in data["custom"]:
            resp_json = data["custom"][ message.get("message").get("data").get("value") ]
            new_pref = default_preference.copy()
            new_pref.update(resp_json)

            print(new_pref)
            return jsonify(new_pref)

    print(message)
    return jsonify(data["default"])

@app.route('/api/truuue/listings', methods=('POST',))
def trulistings():
    # listings = request.get_json()
    listings = json.loads(request.get_json())
    print(type(listings))
    print(">>>>>>>>>>")
    for rec in listings["data"]:
        print(rec)
        print(">>>>>>>>>>>")
        latitude = rec.get("lat")
        longitude = rec.get("lng")
        geohash_code = geohash.encode(latitude, longitude)
        print(latitude, longitude,geohash_code)
    return jsonify({"status": "ok"})


@app.route('/api/session/init', methods=('POST',))
def sessionInit():
    session = request.get_json()
    print(session)
    return jsonify({"status":'ok'})
