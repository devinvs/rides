import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./CreateEvent.css";
import { getEvent } from "./api-utils";

const dummyEvent = {
    id: 2023,
    cars: [
        {
        capcity: 6,
        riders: ["Mat", "Nic", "Dev"],
        driver: "Justin",
        },
        {
        capcity: 4,
        riders: ["Andrew", "Nate"],
        driver: "Jaron",
        },
    ],
    unassigned: ["Logan", "Bill"],
};

const UserRegister = (props) => {

};

const Car = (props) => {
    let car = props.car;

    return (
        <>
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
        </>
    )
}

const DisplayEevnt = (props) => {
    let event = props.event;

    return (
        <>
            <h1>Available Cars</h1>
            <ul>
                {event.cars.map(car =>
                    <li>
                        <Car car={car} />
                    </li>
                )}
            </ul>
        </>
    )
};

export function ViewEventPage(props) {
    const [event, setEvent] = useState();
    const [searchParams] = useSearchParams();
    let eventIdParam = searchParams.get("e");
    console.log(eventIdParam);

    const fetchEventFromApi = (eventId) => {
        setEvent(dummyEvent);
        // getEvent(eventId)
        //     .then(fectchedEvent => setEvent(fectchedEvent))
        //     .catch(error => console.error(error));
    };

    useEffect(() => {
        if (eventIdParam) {
        fetchEventFromApi(eventIdParam);
        }
    }, [eventIdParam]);

  return (
        <>
            {event ? (
                <>
                    <div>
                        <p>Hello the from View Event Page</p>
                        <p>You are viewing the event {event.id}</p>
                    </div>
                    
                    <div>
                        <UserRegister />
                    </div>
                  
                    <div>
                        <DisplayEevnt event={event} />
                    </div>
                </>
            ) : (
                <p>Loading</p>
            )}
        </>
    );
}
