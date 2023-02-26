import random
import base64
from sqlalchemy import (
    Engine,
    Table,
    Column,
    ForeignKey,
    Integer,
    String,
    create_engine,
    MetaData,
    select,
    update,
    delete,
    insert,
    func,
    exists,
    UniqueConstraint
)
import os
from sqlalchemy.orm import (
    declarative_base,
    relationship,
    backref,
    Session,
    scoped_session,
    sessionmaker,
)

Engine: Engine = create_engine('sqlite:///rides.db', echo=True)
Based = declarative_base()

db_session = scoped_session(sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=Engine
))


class Event(Based):
    __tablename__ = "based_events"
    # incrementing number
    id = Column(Integer, primary_key=True)
    # url hash string
    event_id = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    cars = relationship("Car",
                        backref=backref("event", lazy="joined"),
                        cascade="all,delete",
                        lazy="joined",
                        uselist=True)
    riders = relationship("Rider",
                          backref=backref("event", lazy="joined"),
                          cascade="all,delete",
                          lazy="joined",
                          uselist=True)

    def json(self):
        return {
            "id": self.event_id,
            "name": self.name,
            "cars": [car.json() for car in self.cars],
            "unassigned": get_unassigned(db_session, self.event_id)
        }


class Car(Based):
    __tablename__ = "based_cars"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("based_events.id"), nullable=False)
    driver_name = Column(String, primary_key=False, nullable=False)
    capacity = Column(Integer, unique=False, primary_key=False, nullable=False)
    riders = relationship("Rider",
                          backref=backref("car", lazy="joined"),
                          cascade="all,delete",
                          lazy="joined",
                          uselist=True)

    def json(self):
        return {
            "driver_name": self.driver_name,
            "capacity": self.capacity,
            "riders": [rider.name for rider in self.riders],
        }

    __table_args__ = tuple(UniqueConstraint('event_id', 'driver_name'))


class Rider(Based):
    __tablename__ = "based_riders"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("based_events.id"), nullable=False)
    car_id = Column(Integer, ForeignKey("based_cars.id"))
    name = Column(String, nullable=False)
    __table_args__ = tuple(UniqueConstraint('event_id', 'name'))


def get_unassigned(session, event_id: str) -> list[str]:

    (
        session.query(Rider)
            .join(Event)
            .filter(Event.id==event_id)
            .filter(Rider.car_id is None)
    )

    # event = session.query(Event)
    event = session.query(Event).filter_by(event_id=event_id).one()
    result: list[str] = list()
    for rider in event.riders:
        if rider.car is None:
            result.append(rider.name)
    return result


def create_event(session, name: str) -> str:
    # create event id
    # create a random id string
    random_bytes: bytes = random.randbytes(11)
    event_id: str = base64.urlsafe_b64encode(random_bytes).decode('utf-8')
    while session.query(exists().where(Event.event_id == event_id)).scalar():
        random_bytes: bytes = random.randbytes(11)
        event_id = base64.urlsafe_b64encode(random_bytes).decode('utf-8')

    session.add(Event(event_id=event_id, name=name))
    # commit is done when not a select
    session.commit()

    return event_id


def read_event(session, event_id: str) -> Event:
    return session.query(Event).filter(Event.event_id == event_id).first()

def person_in_event(session, event_id: str, person: str) -> bool:
    event: Event = read_event(session, event_id)
    return person in [rider.name for rider in event.riders] or person in [car.driver_name for car in event.cars]

def update_event_name(session, event_id: str, name: str) -> bool:
    session.query(Event).filter_by(Event.event_id == event_id).first().name = name

    session.commit()
    return True


def add_car_to_event(session, event_id: str, name: str, cap: int):
    evt: Event = read_event(session, event_id)
    car: Car = Car(event_id=evt.id, driver_name=name, capacity=cap)
    session.add(car)
    session.commit()

    # Events[event_id].cars.append(car)
    # return Events[event_id]


def add_unassigned_to_event(session, event_id: str, name: str):
    evt: Event = read_event(session, event_id)
    if person_in_event(session, event_id, name):
        return "Aw poopy"

    rider: Rider = Rider(event_id=evt.id, car_id=None, name=name)
    session.add(rider)
    session.commit()


def get_car_by_driver(session, event_id: str, driver: str) -> Car:
    car_list: list[Car] = session.query(Car).filter(Event.event_id == event_id).all()
    for car in car_list:
        if car.driver_name == driver:
            return car
    return None


def assign_person_to_car(session, event_id: str, rider_name: str, driver_name: str) -> str:
    car = get_car_by_driver(session, event_id, driver_name)
    if car is None:
        return "not a driver"
    if car.capacity <= len(car.riders):
        add_unassigned_to_event(session, event_id, rider_name)
        return "car is full"
    rider = Rider(event_id = car.event_id, name = rider_name, car_id = car.id)
    session.add(rider)
    session.commit()
    return ""


def delete_event(session, event_id: str) -> str:
    session.delete(event_id)
    session.commit()


def delete_person(session, event_id: str, name: str):
    car = get_car_by_driver(session, event_id, name)
    if car is None:
        # person has to be a rider
        session.delete()
    else:
        # person is a driver
        for rider in car.riders:
            car.riders.pop(rider)
            add_unassigned_to_event(session, event_id, rider.name)
        session.delete(car)
    session.commit()



def get_event_user_info(session, event_id: str, name: str):
    rider: Rider = (
        session.query(Rider)
            .join(Event)
            .filter(Event.event_id == event_id)
            .filter(Rider.name == name)
            .first()
    )

    if rider is not None:
        if rider.car is None:
            return None

        return {
            "driver": rider.car.driver_name,
            "riders": [r.name for r in rider.car.riders]
        }

    driver: Car = (
        session.query(Car)
            .join(Event)
            .filter(Event.event_id == event_id)
            .filter(Car.driver_name == name)
            .first()
    )

    if driver is not None:
        return {
            "driver": driver.driver_name,
            "riders": [r.name for r in driver.riders]
        }

    return None

def init_database():
    Based.metadata.create_all(bind=Engine)

if not os.path.exists("./rides.db"):
    print("HHHHH")
    init_database()
