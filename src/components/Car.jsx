import { abbreviate } from "../util";
import "./Car.css";

export function Car(props) {
    let car = props.car;
    let seatsRemaining = car.capacity - car.riders.length;
    const emptySeats = [];
    for (let i = 0; i < seatsRemaining; i++) {
        emptySeats.push(
            <button value="Join Car"></button>  
        )
    }

    return (
        <div className="car">
            <p className="driver">{car.driver}</p>
            <ul className="riders">
                {
                    car.riders.map(rider =>
                    <li className="rider"><p>{abbreviate(rider)}</p></li>)
                }
                {
                    emptySeats.map(emptySeat => 
                        <li className="empty-seat">
                            <button>Join</button>
                        </li>)
                }
            </ul>
        </div>
    )
}