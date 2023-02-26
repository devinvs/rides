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
            .then(fectchedEvent => {console.log(fectchedEvent);setEvent(fectchedEvent)})
            .catch(error => console.error(error));
    };

    useEffect(() => {
        if (eventIdParam) {
            fetchEventFromApi(eventIdParam);
        }
    }, [eventIdParam]);

    useEffect(() => {
        if (rider && driver && event) {
            joinCar(eventIdParam, driver).catch(error => console.error(error));
            fetchEventFromApi(eventIdParam);
        }
    }, [rider, driver])

    // console.log(event);
    // console.log(`driver: ${driver}`);
    // console.log(`rider: ${rider}`);

  return (
        <>
            {event? (
                <div className="view-event-page">
                    <div className="banner">
                        <p>Invite Friends: <a href={invite_url}>{invite_url}</a></p>
                    </div>
                    <div className="display-event">
                        <UserRegister eventId={eventIdParam} setParentRider={setRider} />
                        <DisplayEvent
                            event={event}
                            setParentDriver={setDriver}
                            isRiderNameEntered={rider != ""}
                        />
                    </div>
                </div>
            ) : (
                <p>Loading</p>
            )}
        </>
    );
}

