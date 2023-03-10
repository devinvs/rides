import os
import random
import base64
from typing import Optional

from sqlalchemy import (
    create_engine,
    select,
    update,
    delete,
    insert,
    func,
    exists,
)
from sqlalchemy.orm import (
    Session,
    scoped_session,
    sessionmaker,
)

from models import Event, Car, Rider

Engine: Engine = create_engine('sqlite:///rides.db')
db_session = scoped_session(sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=Engine
))

if not os.path.exists("./rides.db"):
    from models import Based
    Based.metadata.create_all(bind=Engine)


# Get riders for a given event who are currently not assigned to a car
def get_unassigned(session, event_id: str) -> list[Rider]:
    return (
        session.query(Rider)
            .join(Event)
            .filter(Event.id==event_id)
            .filter(Rider.car_id == None)
    )

# Create a New Event
def create_event(session, name: str) -> Event:
    random_bytes: bytes = random.randbytes(11)
    event_id: str = base64.urlsafe_b64encode(random_bytes).decode('utf-8')

    while session.query(Event).filter(Event.id == event_id).count() > 0:
        random_bytes: bytes = random.randbytes(11)
        event_id = base64.urlsafe_b64encode(random_bytes).decode('utf-8')

    e = Event(id=event_id, name=name)
    session.add(e)
    session.commit()

    return e


# Get an event by id
def get_event(session, event_id: str) -> Optional[Event]:
    return session.query(Event).filter(Event.id == event_id).first()

# Get all drivers for an event
def get_event_drivers(session, event_id: str) -> list[Car]:
    return session.query(Car).filter(Car.event_id==event_id).all()

# Get a driver in an event by event id and driver name
def event_get_driver(session, event_id: str, name: str) -> Optional[Car]:
    (
        session.query(Car)
            .join(Event)
            .filter(Event.id == event_id)
            .filter(Car.driver_name == name)
            .first()
    )

# Get a rider in an event by event id and driver name
def event_get_rider(session, event_id: str, name: str) -> Optional[Rider]:
    (
        session.query(Rider)
            .join(Event)
            .filter(Event.id == event_id)
            .filter(Rider.name == name)
    )

# Is this person already in this event?
def person_in_event(session, event_id: str, name: str) -> bool:
    if (
    session.query(Car)
        .filter(Car.event_id==event_id)
        .filter(Car.driver_name==name).count() > 0
    ):
        return True

    if (session.query(Rider)
        .filter(Rider.event_id==event_id)
        .filter(Rider.name==name).count() > 0):
        a = (
            session.query(Rider)
                .filter(Rider.event_id == event_id)
                .filter(Rider.name == name)
                .all()
                )
        print(a)
        return True

    return False


# Add a new driver to an event
def event_add_driver(session, event_id: str, name: str, cap: int) -> Car:
    car = Car(event_id=event_id, driver_name=name, capacity=cap)
    session.add(car)
    session.commit()

    add_unassigned_to_car(session, event_id)
    return car

# Add a new rider to an event
def event_add_rider(session, event_id: str, name: str, driver_name: Optional[str]):
    rider = Rider(event_id=event_id, name=name)
    session.add(rider)
    session.commit()

    if driver_name is not None:
        c = event_get_driver(session, event_id, driver_name)
        if c is not None and len(c.riders) != c.cap:
            rider.car_id = c.id
            session.commit()

    add_unassigned_to_car(session, event_id)
    return rider


# This is the magic method that makes everything work.
# Take the list of unassigned riders and try to put them
# into whatever seats are available
def add_unassigned_to_car(session, event_id: str):
    cars = get_event_drivers(session, event_id)

    for r in get_unassigned(session, event_id):
        for c in cars:
            if len(c.riders) != c.capacity:
                r.car_id = c.id
                session.commit()

# Delete an event
def delete_event(session, event_id: str) -> str:
    evt = get_event(event_id)
    session.delete(evt)
    session.commit()

# Delete a person from an event
def delete_person(session, event_id: str, name: str):
    # Delete car if it exists
    car = event_get_driver(session, event_id, name)
    if car is not None:
        session.delete(car)
    
    # Delete person if they exists
    rider = event_get_rider(session, event_id, name)
    if rider is not None:
        session.delete(rider)

    session.commit()

    # Reconcile...
    add_unassigned_to_car(session, event_id)

# get the info for a single person at an event
def get_event_user_info(session, event_id: str, name: str):
    rider: Rider = (
        session.query(Rider)
            .join(Event)
            .filter(Event.id == event_id)
            .filter(Rider.name == name)
            .first()
    )

    if rider is not None:
        if rider.car is None:
            return {"driver": "", "riders": []}

        return {
            "driver": rider.car.driver_name,
            "riders": [r.name for r in rider.car.riders]
        }

    driver: Car = (
        session.query(Car)
            .join(Event)
            .filter(Event.id == event_id)
            .filter(Car.driver_name == name)
            .first()
    )

    if driver is not None:
        return {
            "driver": driver.driver_name,
            "riders": [r.name for r in driver.riders]
        }

    return None


