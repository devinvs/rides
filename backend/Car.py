from enum import Enum


class Car:
    driver: str
    capacity: int
    riders: list[str]
    kicked: list[str]

    def __init__(self, driver: str, capacity: int):
        self.driver = driver
        self.capacity = capacity
        self.riders = list()
        self.kicked = list()


