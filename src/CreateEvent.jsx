import "./CreateEvent.css";

import {useState} from 'react';

export function CreateEventPage(props) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const handleChange = (evt) => {
        setName(evt.target.value);
    }

    const validateName = (name) => {
        // If name is falsy, ie an empty string, undefined, or null, this evaluates to false
        return name;
    }

    const createEvent = () => {
        if (!validateName(name)) {
            setError("Event Name cannot be empty");
        }
        //TODO: actually call create event
    }

    return (
        <div>
            <h1>Create a New Event</h1>
            <input type="text" placeholder="Event Name" value={name} onChange={handleChange}/>

            <br />
            <input type="submit" value="Create" onClick={createEvent}/>
            <p class="error">{error}</p>
        </div>
    )
}

