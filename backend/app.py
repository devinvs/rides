from flask import Flask, request
import database

from database import Car, Event
from database import db_session as session

app = Flask(__name__)

@app.teardown_appcontext
def shutdown_session(exception=None):
    from database import db_session
    db_session.remove()


@app.route("/")
def main_page():
    return "<p>Frontend! Wow!</p>"


@app.route("/events/<event_id>", methods=["GET"])
def get_event_id(event_id: str):
    event: Event = database.read_event(event_id)
    return event.to_json()


@app.route("/events", methods=["POST"])
def post_event():
    if request.method != "POST":
        return "Look at you, you little sussy wussy baka"
    event_id: str = database.create_event(session, request.json.get("event_name"))
    return {
        "id": event_id,
    }


@app.route("/events/<event_id>/drivers", methods=["POST"])
def post_driver(event_id: str):
    if request.method != "POST":
        return "Hmmm, susy. You tried to GET a POST end point..."
    event: Event = database.add_car_to_event(event_id, Car(request.json.get("driver"), int(request.json.get("capacity"))))
    return event.to_json()


@app.route("/events/<event_id>/riders", methods=["POST"])
def post_rider(event_id: str):
    if request.method != "POST":
        return "Hmmm, susy. You tried to GET a POST end point..."
    database.add_unassigned_to_event(event_id, request.json.get("rider"))
    return


@app.route("/events/<event_id>/persons", methods=["GET"])
def get_person_type(event_id: str):
    if request.method != "GET":
        return
    event: Event = database.get_event(event_id)
    person_type = database.check_if_person_exists(event_id, request.json.get("name"))
    return {
        "type": person_type.name,
    }
