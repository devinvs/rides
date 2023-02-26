import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { DisplayEvent } from "./components/DisplayEvent";
import { UserRegister } from "./components/UserRegister";

import { getEvent } from "./api-utils";
import { joinCar } from "./api-utils";
import "./ViewEvent.css";

export function ViewEventPage(_) {
    const [event, setEvent] = useState();
    const [rider, setRider] = useState("");
    const [driver, setDriver] = useState("");

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

    useEffect(() => {
        if (rider!=="" && driver!=="" && event) {
            joinCar(eventIdParam, rider, driver).catch(error => console.error(error));
            setDriver("");
            setRider("");
            fetchEventFromApi(eventIdParam);
        }
    }, [rider, driver])

    console.log(event);
    console.log(`driver: ${driver}`);
    console.log(`rider: ${rider}`);

  return (
        <>
            {event? (
                <div className="view-event-page">
                    <div className="banner">
                        <p>Invite Friends: <a href={invite_url}>{invite_url}</a></p>
                    </div>
                    <div className="display-event">
                        <UserRegister
                            eventId={eventIdParam}
                            setParentRider={setRider}
                            updateParentEvent={fetchEventFromApi}
                            />
                        <DisplayEvent
                            event={event}
                            eventId={eventIdParam}
                            setParentDriver={setDriver}
                            isRiderNameEntered={rider != ""}
                            updateParentEvent={fetchEventFromApi}
                        />
                    </div>
                </div>
            ) : (
                <p>Loading</p>
            )}
        </>
    );
}

