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
    let seatsRemaining = car.capacity - car.riders.length;
    const emptySeats = [];
    for (let i = 0; i < seatsRemaining; i++) {
        emptySeats.push(
            <button value="Join Car"></button>  
        )
    }

    return (
        <div >
            <p>{car.driver}</p>
            <div className="car">
                <ul className="riders">
                    <li>
                    </li>
                    {
                        car.riders.map(rider =>
                        <li className="rider">{rider}</li>)
                    }
                    {
                        emptySeats.map(emptySeat => 
                            <li className="empty-seat">
                                <button>Join Car</button>
                            </li>)
                    }
                </ul>
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
