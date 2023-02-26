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
    if database.read_event(session, event_id) is None:
        return "Invalid event_id: event does not exist"

    event: Event = database.read_event(session, event_id)
    return event.json()


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

    if database.read_event(session, event_id) is None:
        return "Invalid event_id: event does not exist"

    name = request.json.get("driver")
    cap = int(request.json.get("capacity"))

    database.add_car_to_event(session, event_id, name, cap)
    return {"success": "You did it!"}, 200


@app.route("/events/<event_id>/riders", methods=["POST"])
def post_rider(event_id: str):
    if request.method != "POST":
        return "Hmmm, susy. You tried to GET a POST end point..."

    if database.read_event(session, event_id) is None:
        return "Invalid event_id: event does not exist"

    database.assign_person_to_car(session, event_id, request.json.get("rider"), request.json.get("driver"))
    return {"stuff": "wow"}, 200


@app.route("/events/<event_id>/persons", methods=["GET"])
def get_person_type(event_id: str):
    if request.method != "GET":
        return ""

    if database.read_event(session, event_id) is None:
        return "Invalid event_id: event does not exist"

    name = request.args.get("name")
    data = database.get_event_user_info(session, event_id, name)

    if data is None:
        return {"error": "not found"}, 404

    return data
