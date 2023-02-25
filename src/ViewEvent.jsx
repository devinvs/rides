import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { DisplayEevnt } from "./components/DisplayEvent";
import { UserRegister } from "./components/UserRegister";

import { getEvent } from "./api-utils";
import "./ViewEvent.css";

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
