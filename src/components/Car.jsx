import { abbreviate } from "../util";
import {useState, useEffect} from 'react';
import "./Car.css";

const colors = ["red", "blue", "green", "purple", "orange"]

const getColor = (cap) => {
    if (cap >= 12) { return "black" }


    return colors[Math.floor(Math.random() * colors.length)];
}

export function Car(props) {
    const {
        eventId,
        car,
        contWidth,
        setParentSelectedDriver,
        isJoinCarDisabled,
        setIsJoinCarDisabled,
        updateParentEvent
    } = props;
    const joinCar = () => {
        setParentSelectedDriver(car.driver_name);
        updateParentEvent(eventId);
    };

    let seatsRemaining = car.capacity - car.riders.length;

    const [color, _] = useState(getColor(car.capacity));

    let seats = [];

    car.riders.forEach(rider => seats.push(
        <p className="rider">{abbreviate(rider)}</p>
    ));

    for (let i = 0; i < seatsRemaining; i++) {
        seats.push(
            <button
                className="empty-seat"
                onClick={joinCar}
                disabled={isJoinCarDisabled}
            >
                Join
            </button>
        );
    }

    let renderedSeats = [];

    const offset = 200;
    const blockWidth = 55;
    const max_per_line = Math.floor((Math.min(contWidth, window.screen.width)-offset) / blockWidth);
    const num_lines = Math.max(2, Math.floor(car.capacity/max_per_line));
    const num_per_line = Math.ceil(car.capacity / num_lines);

    // console.log(max_per_line)

    for (let i=0; i<num_lines; i++) {
        renderedSeats.push([]);
        for (let j=0; j<num_per_line; j++) {
            let num = i*num_per_line+j;

            if (num >= car.capacity) { break; }

            renderedSeats[i].push(seats[num]);
        }
    }

    return (
        <div className="car">
            <p className="driver">{car.driver_name}</p>
            <div className={"riders " + color}>
                <div className="wheel1" />
                <div className="wheel2" />
                {
                    renderedSeats.map(row =>
                        <div className="rider-row">
                            {
                                row.map(cell =>
                                    {return cell}
                            )}
                        </div>
                )}
                <div className="wheel3" />
                <div className="wheel4" />
            </div>
        </div>
    )
}
