import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from pprint import pprint
import pymongo

client = pymongo.MongoClient("mongodb://sara:truexpert1@ds151282.mlab.com:51282/truexpert")
db = client.truexpert


# session_data = {
#     'session_id': 12341234,
#     'data' : {  
#         'yes_expat': 'Yes',
#         'no_expat': 'Yes'
#         }
# }

def find(session_id):
    record = db.session_details.find_one({'session_id':session_id})
    return record

def insert(record):
    if not find (record.get("session_id")):
        db.session_details.insert_one(record)

def update(record):
    db.session_details.save(record)