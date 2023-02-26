import { Car } from "./Car";
import "./DisplayEvent.css";

const Line = () => {
    return <div className="parking-line"></div>
}

export function DisplayEevnt(props) {
    let event = props.event;

    return (
        <div className="parking-lot">
            {event.cars.map((car, i) =>
                <>
                <Car car={car} />
                {i===car.length-1? null: <Line />
                }
                </>
            )}
        </div>
    )
};
