import { abbreviate } from "../util";
import "./Car.css";

export function Car(props) {
    let car = props.car;
    let seatsRemaining = car.capacity - car.riders.length;

    let contWidth = props.contWidth;

    let seats = [];

    car.riders.forEach(rider => seats.push(
        <p className="rider">{abbreviate(rider)}</p>
    ));

    for (let i = 0; i < seatsRemaining; i++) {
        seats.push(<button className="empty-seat">Join</button>)
    }

    let renderedSeats = [];

    const blockWidth = 55;
    const max_per_line = Math.floor(contWidth/ blockWidth);
    const num_lines = Math.max(2, Math.floor(car.capacity/max_per_line));
    const num_per_line = Math.ceil(car.capacity / num_lines);

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
            <p className="driver">{car.driver}</p>
            <div className="riders">
                <div className="wheel1" />
                <div className="wheel2" />
                {
                    renderedSeats.map((row, i) =>
                        <div className="rider-row">
                            {
                                row.map((cell, i) =>
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
