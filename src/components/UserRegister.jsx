import "./UserRegister.css";

import {useState} from 'react';
import { login } from "../api-utils";
const nameRE = new RegExp("[\\w' ]+");

const State = {
    Login: "Login",
    Name: 'Name',
    DriveRide: 'DriveRide',
    Seats: 'Seats',
    ShowRide: 'ShowRide',
    ShowDrive: 'ShowDrive'
};

export function UserRegister(props) {
    const {eventId, setParentRider} = props;

    const [name, setName] = useState("");
    const [riders, setRiders] = useState([]);
    const [driver, setDriver] = useState("");
    const [error, setError] = useState("");
    const [uiState, setUiState] = useState(State.Login);

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

    const startLoginWorkflow = (event) => {
        event.preventDefault();
        login(eventId, name)
            .then(res => {
                setRiders(res.riders);
                setDriver(res.driver);

                if (res.driver === name) {
                    setUiState(State.ShowRide);
                }
                else if (res.riders.includes(name)) {
                    setUiState(State.ShowDrive);
                }
                else {
                    setUiState(State.Name)
                }
            })
            .catch(error => console.error(error));
    }

    switch (uiState) {
        case State.Login:
            return (
                <form onSubmit={startLoginWorkflow}>
                    <input type="text" placeholder="Enter name" value={name} onChange={onNameChange}/>
                    <input type="submit" value="Login" disabled={name===""}/>
                    <p className="error">{error}</p>
                </form>
            )
        case State.Name:
            return (
                <form>
                    <input type="text" placeholder="Enter name" value={name} onChange={onNameChange}/>
                    <div>
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
            return (
                <p>{driver}</p>
            );
        case State.ShowRide:
            return (
                <>
                    <ul>
                        {
                            riders.map(rider => 
                            <p>{rider}</p>)
                        }
                    </ul>
                </>
            );
        default:
            return;
    }
};
