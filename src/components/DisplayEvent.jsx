import { Car } from "./Car";

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