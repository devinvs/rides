import "./CreateEvent.css";
import {createEvent} from "./api-utils";

import {apiBase, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export function CreateEventPage(_) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (evt) => {
        setName(evt.target.value);
    }

    const validateName = (name) => {
        // If name is falsy, ie an empty string, undefined, or null, this evaluates to false
        return name;
    }

    const newEvent = () => {
        if (!validateName(name)) {
            setError("Event Name cannot be empty");
        }

        createEvent(name)
            .then(res => {
                // On success we redirect to the appropriate page for their event
                const url = `${apiBase}/events?e=${res.id}`
                navigate(url);
            })
            .catch((e) => {
                setError(e);
            })
    }

    return (
        <div className="CreateEventPage">
            <h1>Create a New Event</h1>
            <input type="text" placeholder="Event Name" value={name} onChange={handleChange}/>

            <br />
            <input type="submit" value="Create" onClick={newEvent}/>
            <p class="error">{error}</p>
        </div>
    )
}

