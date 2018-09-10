from app import app
from flask import request, jsonify
import json
import geohash
from app.dbutil import *


#VALUE_RENT_INT_STUDENTS = 'rent_int_su'
PRESET = "basic-preset" #need to clarify
EXPAT_YES = 'yes_expat'
AMENITIES = 'yes_amenities'

with open('app\config.json') as f:
    content =f.read()
    data =json.loads( content  )

# load default_preference from JSON file    
default_preference = data["default"]
default_keys= default_preference.keys()
@app.route('/')
@app.route('/index')
def index():
    return "Welcome to Analytics Server"

@app.route('/api/session/init', methods=('POST',))
def sessionInit():
    session = request.get_json()
    session_data = session.get("sessionId")
    print(session_data)
    insert({'session_id': session_data}) # save this session id in mongodb
    return jsonify({'session_id': session_data})
    
@app.route('/api/chat/messages', methods=('POST',))
def messages():

    message = request.get_json()
    session_data = message.get("sessionId")
    print(session_data)

    print(json.dumps(message, indent=4))

                
    r = find(session_data) # find session_id from mongo_db

    # message.data.value, message.data.type
    if message and message.get("message").get("data").get("type") == PRESET :
        if message.get("message").get("data").get("value") == EXPAT_YES:

            resp_json = data["custom"][ message.get("message").get("data").get("value") ]

            if r:
                r.update({ EXPAT_YES: 'Yes'} )
                update(r)
            
            new_pref = default_preference.copy()
            new_pref.update(resp_json)
            return jsonify(new_pref)
    
        
        if message.get("message").get("data").get("value") == AMENITIES:
            __key = message.get("message").get("data").get("amenity").get("value")
            if __key in default_keys:
                
                if r:
                    r.update({ __key : 'Yes'})
                    update(r)

                pref_json_value = data["default"][__key ] + 0.5
                data["default"][ __key] = pref_json_value
                new_pref = default_preference.copy()
                new_pref.update(data)

                return jsonify(new_pref)

    new_pref = default_preference

    return jsonify(new_pref)


@app.route('/api/truuue/listings', methods=('POST',))
def trulistings():
    
    listings = request.get_json()

    session_data = listings.get("sessionId")
    print(">>>>>>>>>>> ",session_data)
    
    data = listings.get("response")    
    new_listings = json.loads(data)

    listing_data = []
    for list_data in new_listings["data"]:
        list_latitude = list_data["lat"]
        list_longitude = list_data["lng"]
        geo_code_dtl = geohash.encode(list_latitude, list_longitude)

        list_co_ordinates={
                    'latitude': list_latitude, 
                    'longitude': list_longitude, 
                    'geo_hash_code': geo_code_dtl
                    }
        listing_data.append(list_co_ordinates)

    listing_json = {'listing_dtl': listing_data}
    print(listing_json)

    print()



    # nearest_listings(listing_details)
    # ranked_list = rank_listings()

    return jsonify(listing_json)
