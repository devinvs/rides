import { Car } from "./Car";
import "./DisplayEvent.css";

export function DisplayEevnt(props) {
    let event = props.event;

    return (
        <div className="parking-lot">
            {event.cars.map(car =>
                <>
                <Car car={car} />
                </>
            )}
        </div>
    )
};