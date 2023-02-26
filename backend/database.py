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

db_session = scoped_session(sessionmaker(
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
    event_id = Column(Integer, ForeignKey("based_events.id"), nullable=False)
    driver_name = Column(String, unique=True, primary_key=False, nullable=False)
    capacity = Column(Integer, unique=False, primary_key=False, nullable=False)
    riders = relationship("Rider",
                          backref=backref("car", lazy="joined"),
                          cascade="all,delete",
                          lazy="joined",
                          uselist=True)
    kicked = relationship("Rider",
                          backref=backref("kicked_cars", lazy="joined"),
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
    event_id = Column(Integer, ForeignKey("based_events.id"), nullable=False)
    car_id = Column(Integer, ForeignKey("based_cars.id"))
    name = Column(String, nullable=False)


def get_unassigned(session, event_id: str) -> list[str]:
    event = session.scalars(select(Event).where(event_id=event_id)).one()
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
    while session.query(Event).filter_by(event_id=event_id).first() is None:
        random_bytes: bytes = random.randbytes(11)
        event_id = base64.urlsafe_b64encode(random_bytes).decode('utf-8')

    session.add(Event(event_id=event_id, name=name))
    # commit is done when not a select
    session.commit()

    return event_id


def read_event(session, event_id: str) -> Event:
    
    event_found: Event = session.scalars(select(Event).where(event_id=event_id)).one()
    
    return event_found

    # return select("event").where(engine.events.event_id == event_id)


# def update_event(event_id: str, name: str, cars: list[Car], unassigned: list[str]):
#     
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


def update_event_name(session, event_id: str, name: str) -> bool:
    session.query(Event).filter_by(Event.event_id == event_id).first().name = name

    session.commit()
    return True


def add_car_to_event(session, event_id: str, car: Car) -> Event:
    event = session.execute(select(Event).where(event_id=event_id))
    session.execute(event.cars.append(car))
    session.commit()
    return event

    # Events[event_id].cars.append(car)
    # return Events[event_id]


def add_unassigned_to_event(session, event_id: str, name: str) -> bool:
    # Events[event_id].unassigned.append(unassigned)
    
    session.query(exists().where(Event.c.event_id == event_id)).riders.append(name)
    session.commit()
    
    return True


def get_car_by_driver(session, event_id: str, driver: str) -> Car:
    car_list: list[Car] = session.query(exists().where(Event.c.event_id == event_id)).cars
    for car in car_list:
        if car.driver_name == driver:
            return car
    return None


def assign_person_to_car(session, event_id: str, rider_name: str, driver_name: str) -> str:
    
    car: Car = get_car_by_driver(event_id, driver_name)
    session.query(exists().where(Event.c.event_id == event_id and Car == car)).riders.append(rider_name)
    session.commit()
    
    return ""
    # for car in Events[event_id].cars:
    #     if car.capacity > car.riders.len():
    #         car.riders.append(name)
    #         # return the driver that name was assigned to
    #         return car.driver
    #
    # return ""


def check_if_person_exists(session, event_id: str, name: str) -> bool:
    
    person_exists: bool = session.query(exists().where(Event.c.event_id == event_id and Event.c.riders.name == name)).scalar()
    

    return person_exists


def gather_person_info(session, event_id: str, name: str) -> dict[str, any]:
    event = session.query(Car.driver_name, Car.riders).select_from(Car).join(Car.events).where(Event.event_id==event_id)


def delete_event(session, event_id: str) -> str:
    session.delete(event_id)


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
        return {
            "is_driver": True,
            "riders": driver.riders
        }

    return None
