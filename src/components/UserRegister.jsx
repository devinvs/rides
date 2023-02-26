import "./UserRegister.css";

import {useState} from 'react';

const nameRE = new RegExp("[\\w' ]+");

const State = {
    Name: 'Name',
    DriveRide: 'DriveRide',
    Seats: 'Seats',
    ShowRide: 'ShowRide',
    ShowDrive: 'ShowDrive'
};

export function UserRegister(props) {
    const {eventId, setParentRider} = props;

    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [uiState, setUiState] = useState(State.Name);

    const onNameChange = (e) => {
        setName(e.target.value);
        setParentRider(e.target.value);
    }

    const validateName = (name) => {
        if (!name) {
            setError("Name cannot be empty");
            return false;
        }

        if (!nameRE.test(name)) {
            setError("Name can only contain letters, spaces, and apostrophes");
            return false;
        }

        return true;
    }

    const startDriverWorkflow = () => {
        if (!validateName(name)) {
            return
        }
        setUiState(State.Seats);
    }
    
    const startRiderWorkflow = () => {
        if (!validateName(name)) {
            return
        }
        
        setUiState(State.ShowRide);
    }

    switch(uiState) {
        case State.Name:
            return (
                <form>
                    <input type="text" placeholder="Enter name" value={name} onChange={onNameChange}/>
                    <div>
                        {/* <input type="submit" value="I need a ride" onClick={startDriverWorkflow}/> */}
                        <input type="submit" value="I can drive"/>
                    </div>
                    <p className="error">{error}</p>
                </form>
            );
        case State.DriveRide:
            return;
        case State.Seats:
            return (
                <form>
                    <input type="text" placeholder="How many people?" />
                    <input type="submit" value="Next" />
                    <p className="error">{error}</p>
                </form>
            );
        case State.ShowDrive:
            return;
        case State.ShowRide:
            return;
        default:
            return;
    }
};
