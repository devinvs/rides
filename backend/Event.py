import Car

import flask


class Event:
    event_id: str
    event_name: str
    cars: list[Car]
    unassigned: list[str]

    def __init__(self, event_id: str, event_name: str):
        self.event_id = event_id
        self.event_name = event_name
        self.cars = list()
        self.unassigned = list()

    def to_json(self):
        return {
            "id": self.event_id,
            "cars": [
                {
                    "capacity": car.capacity,
                    "riders": flask.json.jsonify(car.riders),
                    "driver": car.driver,
                    "kicked": flask.json.jsonify(car.kicked),
                } for car in self.cars
            ],
            "unassigned": flask.json.jsonify(self.unassigned),
        }
