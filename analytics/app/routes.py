from app import app
from flask import request, jsonify

@app.route('/')
@app.route('/index')
def index():
    return "Welcome to Analytics Server"

@app.route('/chat/messages', methods=('POST',))
def messages():
    message = request.get_json()
    print(message)
    return jsonify({"status":'ok'})

@app.route('/truuue/listings', methods=('POST',))
def trulistings():
    listings = request.get_json()
    print(listings)
    return jsonify({"status":'ok'})
