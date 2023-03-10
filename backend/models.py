from sqlalchemy import (
    Table,
    Column,
    ForeignKey,
    Integer,
    String,
    MetaData,
    UniqueConstraint
)

from sqlalchemy.orm import (
    declarative_base,
    relationship,
    backref
)

import database as db

Based = declarative_base()

class Event(Based):
    __tablename__ = "based_events"
    # url hash string
    id = Column(String, primary_key=True, unique=True, nullable=False)
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
            "id": self.id,
            "name": self.name,
            "cars": [car.json() for car in self.cars],
            "unassigned": [rider.name for rider in self.riders if rider.car_id is None]
        }


class Car(Based):
    __tablename__ = "based_cars"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("based_events.id"), nullable=False)
    driver_name = Column(String, primary_key=False, nullable=False)
    capacity = Column(Integer, unique=False, primary_key=False, nullable=False)

    riders = relationship("Rider",
                          backref=backref("car", lazy="joined"),
                          lazy="joined",
                          uselist=True)
    __table_args__ = tuple(UniqueConstraint('event_id', 'driver_name'))

    def json(self):
        return {
            "driver_name": self.driver_name,
            "capacity": self.capacity,
            "riders": [rider.name for rider in self.riders],
        }

    def __repr__(self):
        return f"<Driver {self.driver_name} {self.capacity}>"


class Rider(Based):
    __tablename__ = "based_riders"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("based_events.id"), nullable=False)
    car_id = Column(Integer, ForeignKey("based_cars.id"), )
    name = Column(String, nullable=False)
    __table_args__ = tuple(UniqueConstraint('event_id', 'name'))

    def __repr__(self):
        return f"<Rider {self.name}>"
