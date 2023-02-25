import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./ViewEvent.css";
import {getEvent } from "./api-utils";

const UserRegister = (props) => {

    return (
        <>
            <form>
                <input type="text" placeholder="Enter name"/>
                <div>
                    <input type="submit" value="I need a ride" />
                    <input type="submit" value="I can drive" />
                </div>
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
        <div className="parking-lot">
            {event.cars.map(car =>
                <>
                <Car car={car} />
                </>
            )}
        </div>
    )
};

export function ViewEventPage(props) {
    const [event, setEvent] = useState();
    const [searchParams] = useSearchParams();

    let eventIdParam = searchParams.get("e");
    let invite_url = `${window.location}`;

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
                        <p>Invite Friends: <a href={invite_url}>{invite_url}</a></p>
                    </div>
                    <div className="display-event">
                        <UserRegister />
                        <DisplayEevnt event={event} />
                    </div>
                </div>
            ) : (
                <p>Loading</p>
            )}
        </>
    );
}
