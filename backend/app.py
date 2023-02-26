from flask import Flask, request
from flask_cors import CORS
import database

from database import Car, Event
from database import db_session as session

app = Flask(__name__, instance_relative_config=True, static_folder="../build", static_url_path="/")
CORS(app)

@app.teardown_appcontext
def shutdown_session(exception=None):
    from database import db_session
    db_session.remove()


@app.route("/")
def main_page():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found():
    return app.send_static_file('index.html')


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

    event_name: str = request.json.get("event_name")
    if event_name is None or len(event_name) == 0:
        return {"error", "event_name is empty"}, 400
    event_id: str = database.create_event(session, event_name)
    return {"id": event_id}, 200


@app.route("/events/<event_id>/drivers", methods=["POST"])
def post_driver(event_id: str):
    event: Event = database.read_event(session, event_id)
    if event is None:
        return {"error": "event does not exist"}, 400

    name = request.json.get("driver")
    if name is None or len(name) == 0:
        return {"error": "driver name is not provided"}, 400

    cap = int(request.json.get("capacity"))

    if cap == 0:
        return {"error": "Wow, cool... you can drive yourself... good for you..."}, 400
    elif cap < 0:
        return {"error": "A negative capacity? Homie, are you drunk rn?!?!"}, 400

    if database.person_in_event(session, event_id, name):
        return {"error": "please enter a name to sign up"}, 400

    database.add_car_to_event(session, event_id, name, cap)
    return {"success": True}, 200



# @app.route("/events/<event_id>/drivers/<name>", methods=["DELETE"])
# def delete_driver(event_id: str, name: str):
#     event: Event = database.read_event(session, event_id)
#     if event is None:
#         return {"error": "event does not exist"}, 400
#     if name is None or len(name) == 0:
#         return {"error": "driver name is not provided"}, 400
#     if not database.person_in_event(session, event_id, name):
#         return {"error": "driver not in event"}, 400
#
#     database.delete_person(session, event_id, name)
#     return {"success": True}, 200

@app.route("/events/<event_id>/riders", methods=["POST"])
def post_rider(event_id: str):
    if request.method != "POST":
        return "Hmmm, susy. You tried to GET a POST end point...", 400

    if database.read_event(session, event_id) is None:
        return {"error": "event does not exist"}, 400

    rider: str = request.json.get("rider")
    if rider is None or len(rider) == 0:
        return {"error": "please enter a name to sign up"}, 400

    if database.person_in_event(session, event_id, rider):
        return {"error": "name already taken"}, 400

    driver: str = request.json.get("driver")
    if driver is None:
        database.add_unassigned_to_event(session, event_id, rider)
        return {"success": True}, 200

    if len(driver) == 0:
        return {"error": "driver is not provided"}, 400

    result = database.assign_person_to_car(session, event_id, rider, driver)
    if len(result) != 0:
        return {"error": result}, 400
    return {"success": True}, 200

# @app.route("/events/<event_id>/riders/<name>", methods=["DELETE"])
# def delete_rider(event_id: str, name: str):
#     if database.read_event(session, event_id) is None:
#         return {"error": "event does not exist"}, 400
#
#     rider: str = request.json.get("rider")
#     if rider is None or len(rider) == 0:
#         return {"error": "please enter a name to sign up"}, 400
#
#     if database.person_in_event(session, event_id, rider):
#         return {"error": "name already taken"}, 400
#
#     driver: str = request.json.get("driver")
#     if driver is None or len(driver) == 0:
#         return {"error": "driver is not provided"}, 400
#
#     result = database.assign_person_to_car(session, event_id, rider, driver)
#     if len(result) != 0:
#         return {"error": result}, 400
#     return {"success": True}, 200


@app.route("/events/<event_id>/persons", methods=["GET"])
def get_person_type(event_id: str):
    if database.read_event(session, event_id) is None:
        return {"error": "event does not exist"}, 400

    name = request.args.get("name")
    if name is None:
        return {"error": "no 'name' keyword arg in URL"}, 400
    data = database.get_event_user_info(session, event_id, name)

    if data is None:
        return {"error": "name not found"}, 404

    return data


@app.route("/events/<event_id>", methods=["DELETE"])
def delete_event(event_id: str):
    if database.read_event(session, event_id) is None:
        return "Invalid event_id: event does not exist", 400

    database.delete_event(session, event_id)
    return {"success": True}, 200


@app.route("/events/<event_id>/persons/<name>", methods=["DELETE"])
def delete_person(event_id: str, name):
    if database.read_event(session, event_id) is None:
        return {"error": "event does not exist"}, 400

    if not database.person_in_event(session, event_id, name):
        return {"error": "cannot delete a nonexistent person"}, 400

    database.delete_person(session, event_id, name)
    return {"success": True}, 200
