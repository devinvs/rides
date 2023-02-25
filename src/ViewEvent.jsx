import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./ViewEvent.css";
import { getEvent } from "./api-utils";

const UserRegister = (props) => {

    return (
        <>
            <form>
                <label>
                    Name:
                    <input type="text" name="Enter name"/>
                </label>
                <input type="submit" value="I need a ride" />
                <input type="submit" value="I can drive" />
            </form>
        </>
    )
};

const Car = (props) => {
    let car = props.car;

    return (
        <div className="car">
            <div>
                <h3>Driver</h3>
                <p>{car.driver}</p>
            </div>
            <div>
                <h4>Passengers</h4>
                <ul>
                    {car.riders.map(rider =>
                        <li>{rider}</li>)}
                </ul>
            </div>
            <div>
                <button value="Join Car"></button>
            </div>
        </div>
    )
}

const DisplayEevnt = (props) => {
    let event = props.event;

    return (
        <div className="display-event">
            <h1>Available Cars</h1>
            <ul>
                {event.cars.map(car =>
                    <li>
                        <Car car={car} />
                    </li>
                )}
            </ul>
        </div>
    )
};

export function ViewEventPage(props) {
    const [event, setEvent] = useState();
    const [searchParams] = useSearchParams();
    let eventIdParam = searchParams.get("e");
    console.log(eventIdParam);

    const fetchEventFromApi = (eventId) => {
        getEvent(eventId)
            .then(fectchedEvent => setEvent(fectchedEvent))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        if (eventIdParam) {
        fetchEventFromApi(eventIdParam);
        }
    }, [eventIdParam]);

  return (
        <>
            {event ? (
                <div className="view-event-page">
                    <div className="banner">
                        <p>Hello the from View Event Page</p>
                        <p>You are viewing the event {event.id}</p>
                    </div>
                    
                    <UserRegister />
                    <DisplayEevnt event={event} />
                </div>
            ) : (
                <p>Loading</p>
            )}
        </>
    );
}
