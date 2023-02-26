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
    exists
)
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

DB_Session = scoped_session(sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=Engine
))



class Event(Based):
    __tablename__ = "based_events"
    id = Column(Integer, primary_key=True)
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
            "cars": [car.json for car in self.cars],
            "unassigned": get_unassigned(self.event_id)
        }


class Car(Based):
    __tablename__ = "based_cars"
    id = Column(Integer, primary_key=True)
    # event_id = Column(String, unique=True, primary_key=False, nullable=False)
    driver_name = Column(String, unique=True, primary_key=False, nullable=False)
    capacity = Column(Integer, unique=False, primary_key=False, nullable=False)
    riders = relationship("Rider",
                          backref=backref("car", lazy="joined"),
                          cascade="all,delete",
                          lazy="joined",
                          uselist=True)
    kicked = relationship("Rider",
                          backref=backref("car", lazy="joined"),
                          cascade="all,delete",
                          lazy="joined",
                          uselist=True)

    def json(self):
        return {
            "driver_name": self.driver_name,
            "capacity": self.capacity,
            "riders": [rider.name for rider in self.riders],
            "kicked": [rider.name for rider in self.kicked],
        }


class Rider(Based):
    __tablename__ = "based_riders"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)


def get_unassigned(event_id: str) -> list[str]:
    session = DB_Session()
    event = session.scalars(select(Event).where(event_id=event_id)).one()
    result: list[str] = list()
    for rider in event.riders:
        if rider.car is None:
            result.append(rider.name)
    session.remove()
    return result


def create_event(name: str) -> str:
    session = DB_Session()

    # create event id
    # create a random id string
    random_bytes: bytes = random.randbytes(11)
    event_id: str = base64.urlsafe_b64encode(random_bytes).decode('utf-8')
    while session.query(Event).filter_by(event_id=event_id).first() is None:
        random_bytes: bytes = random.randbytes(11)
        event_id = base64.urlsafe_b64encode(random_bytes).decode('utf-8')

    session.add(Event(event_id=event_id, name=name))
    # commit is done when not a select
    session.commit()
    session.remove()

    return event_id


def read_event(event_id: str) -> Event:
    session = DB_Session()
    event_found: Event = session.scalars(select(Event).where(event_id=event_id)).one()
    session.remove()
    return event_found

    # return select("event").where(engine.events.event_id == event_id)


# def update_event(event_id: str, name: str, cars: list[Car], unassigned: list[str]):
#     session = DB_Session()
#     event_id = session.execute(select(Event).where(event_id=event_id))
#     if event_id:
#         # update
#         session.
#     else:
#         # create
#         create_event(name)
#     Events[event_id].event_name = name
#     Events[event_id].cars = cars
#     Events[event_id].unassigned = unassigned


def update_event_name(event_id: str, name: str) -> bool:
    session = DB_Session()
    session.query(Event).filter_by(Event.event_id == event_id).first().name = name

    session.commit()
    session.remove()
    return True


def add_car_to_event(event_id: str, car: Car) -> Event:
    session = DB_Session()
    event = session.execute(select(Event).where(event_id=event_id))
    session.execute(event.cars.append(car))

    session.remove()
    return event

    # Events[event_id].cars.append(car)
    # return Events[event_id]


def add_unassigned_to_event(event_id: str, name: str) -> bool:
    #Events[event_id].unassigned.append(unassigned)
    session = DB_Session()
    session.query(exists().where(Event.c.event_id == event_id)).riders.append(name)
    session.commit()
    session.remove()
    return True


def get_car_by_driver(event_id: str, driver: str) -> Car:
    session = DB_Session
    car_list: list[Car] = session.query(exists().where(Event.c.event_id == event_id)).cars
    for car in car_list:
        if car.driver_name == driver:
            return car
    return None


def assign_person_to_car(event_id: str, rider_name: str, driver_name: str) -> str:
    session = DB_Session()
    car: Car = get_car_by_driver(event_id, driver_name)
    session.query(exists().where(Event.c.event_id == event_id and Car == car)).riders.append(rider_name)
    session.commit()
    session.remove()
    return ""
    # for car in Events[event_id].cars:
    #     if car.capacity > car.riders.len():
    #         car.riders.append(name)
    #         # return the driver that name was assigned to
    #         return car.driver
    #
    # return ""


def check_if_person_exists(event_id: str, name: str) -> bool:
    session = DB_Session()
    person_exists: bool = session.query(exists().where(Event.c.event_id == event_id and Event.c.riders.name == name)).scalar()
    session.remove()

    return person_exists


def gather_person_info(event_id: str, name: str) -> dict[str, any]:
    session = DB_Session()
    event = session.query(Car.driver_name, Car.riders).select_from(Car).join(Car.events).where(Event.event_id==event_id)


def delete_event(event_id: str) -> str:
    # Events.pop(event_id)
    session = DB_Session()
    session.flush(event_id)
    session.remove()

def get_event_user_info(event_id: str, name: str):
    session = DB_Session()

    rider: Rider = (
        session.query(Rider)
            .join(Event)
            .filter(Event.event_id == event_id)
            .filter(Rider.name == name)
            .first()
    )
    if rider is not None:
        if rider.car is None:
            session.remove()
            return None

        session.remove()
        return {
            "is_driver": False,
            "riders": rider.car.riders
        }

    driver: Car = (
        session.query(Car)
            .join(Event)
            .filter(Event.event_id == event_id)
            .filter(Car.driver_name == name)
    )

    if driver is not None:
        session.remove()
        return {
            "is_driver": True,
            "riders": driver.riders
        }

    return None