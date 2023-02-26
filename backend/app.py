from flask import Flask, request
from flask_cors import CORS
import database

from database import Car, Event
from database import db_session as session




app = Flask(__name__)
CORS(app)

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
        return {"error": "event does not exist"}, 400

    event: Event = database.read_event(session, event_id)
    return event.json(), 200


@app.route("/events", methods=["POST"])
def post_event():
    if request.method != "POST":
        return "Look at you, you little sussy wussy baka", 400

    event_id: str = database.create_event(session, request.json.get("event_name"))
    return {"id": event_id}, 200


@app.route("/events/<event_id>/drivers", methods=["POST"])
def post_driver(event_id: str):
    if request.method != "POST":
        return "Hmmm, susy. You tried to GET a POST end point...", 400

    event: Event = database.read_event(session, event_id)
    if event is None:
        return {"error": "event does not exist"}, 400

    name = request.json.get("driver")
    cap = int(request.json.get("capacity"))

    if cap == 0:
        return {"error": "Wow, cool... you can drive yourself... good for you..."}, 400
    elif cap < 0:
        return {"error": "A negative capacity? Homie, are you drunk rn?!?!"}, 400

    if database.person_in_event(session, event_id, name):
        return {"error": "name already taken"}, 400

    database.add_car_to_event(session, event_id, name, cap)
    return {"success": True}, 200


@app.route("/events/<event_id>/riders", methods=["POST"])
def post_rider(event_id: str):
    if request.method != "POST":
        return "Hmmm, susy. You tried to GET a POST end point...", 400

    if database.read_event(session, event_id) is None:
        return {"error": "event does not exist"}, 400

    if database.person_in_event(session, event_id, request.json.get("rider")):
        return {"error": "name already taken"}, 400

    database.assign_person_to_car(session, event_id, request.json.get("rider"), request.json.get("driver"))
    return {"success": True}, 200


@app.route("/events/<event_id>/persons", methods=["GET"])
def get_person_type(event_id: str):
    if database.read_event(session, event_id) is None:
        return "Invalid event_id: event does not exist", 400

    name = request.args.get("name")
    if name is None:
        return {"error": "no 'name' keyword arg in URL"}, 400
    data = database.get_event_user_info(session, event_id, name)

    if data is None:
        return {"error": "not found"}, 404

    return data


@app.route("/events/<event_id>", methods=["DELETE"])
def delete_event(event_id: str):
    if database.read_event(session, event_id) is None:
        return "Invalid event_id: event does not exist", 400

    database.delete_event(event_id)
    return {"sucess": True}, 200


@app.route("/events/<event_id>/persons", methods=["DELETE"])
def delete_person(event_id: str, name):
    if database.read_event(session, event_id) is None:
        return {"error": "event does not exist"}, 400

    if not database.person_in_event(session, event_id, request.json.get("rider")):
        return {"error": "cannot delete a nonexistent person"}, 400

    database.delete_person(session, event_id, name)