import { Car } from "./Car";
import "./DisplayEvent.css";

const Line = () => {
    return <div className="parking-line"></div>
}

export function DisplayEvent(props) {
    let event = props.event;

    return (
        <div className="parking-lot">
            {event.cars.map(car =>
                <>
                <Line />
                <Car car={car} />
                </>
            )}
            <Line />
        </div>
    )
};
