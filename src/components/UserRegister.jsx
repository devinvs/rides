import "./UserRegister.css";

import {useEffect, useState} from 'react';
import { login, addCarToEvent } from "../api-utils";
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
    const {
        eventId, 
        setParentRider, 
        updateParentEvent,
        autoLoginState,
        setAutoLoginState,
        setIsJoinCarDisabled
    } = props;

    useEffect(() => {
        if (autoLoginState){
            startLoginWorkflow();
            setAutoLoginState(false);
            setIsJoinCarDisabled(true);
        }
    }, [autoLoginState, setAutoLoginState])

    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState();
    const [riders, setRiders] = useState([]);
    const [driver, setDriver] = useState("");
    const [error, setError] = useState("");
    const [uiState, setUiState] = useState(State.Login);

    const onNameChange = (e) => {
        
        setName(e.target.value);
        setParentRider(e.target.value);
        // if (!validateName(name)) {
        //     return
        // }
    }

    const onCapacityChange = (e) => {
        setCapacity(e.target.value);
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

        // setError("");
        return true;
    }

    const startDriverWorkflow = (event) => {
        event.preventDefault();
        if (!validateName(name)) {
            return
        }
        setIsJoinCarDisabled(true);
        setUiState(State.Seats);
    }

    const createCarForCurrentEvent = (event) => {
        event.preventDefault();

        addCarToEvent(eventId, name, capacity)
            .then(() => {
                updateParentEvent(eventId);
                startLoginWorkflow(event);
            })
            .catch(error => console.error(error));
    }

    const startLoginWorkflow = (event) => {
        if (event){
            event.preventDefault();
        }
        
        if (!validateName(name)) {
            return
        }
        
        login(eventId, name)
            .then(res => {
                setRiders(res.riders);
                setDriver(res.driver);

                if (res.driver === name) {
                    setUiState(State.ShowRide);
                }
                else {
                    setUiState(State.ShowDrive);
                }
            })
            .catch(() => setUiState(State.Name));
    }

    const JoinInfo = () => {
        return (
            <div className="join-info">
                <p>
                    <i>or click on a join button to place yourself in a car</i>
                </p>
            </div>
        )
    }

    switch (uiState) {
        case State.Login:
            return (
                <form onSubmit={startLoginWorkflow}>
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={onNameChange}
                        required
                    />
                    <input type="submit" value="Login"/>
                    <p className="error">{error}</p>
                    <JoinInfo />
                </form>
            )
        case State.Name:
            return (
                <form onSubmit={startDriverWorkflow}>
                    <div>
                        <input type="submit" value="I can drive"/>
                    </div>
                    <p className="error">{error}</p>
                    <JoinInfo />
                </form>
            );
        case State.DriveRide:
            return;
        case State.Seats:
            return (
                <form onSubmit={createCarForCurrentEvent}>
                    <input
                        type="number"
                        placeholder="How many people?"
                        min="1"
                        value={capacity}
                        onChange={onCapacityChange}
                        required
                    />
                    <input type="submit" value="Next" />
                    <p className="error">{error}</p>
                </form>
            );
        case State.ShowDrive:
            return (
                <div className="show-drive">
                    <h2>Your Driver Is {driver}</h2>
                </div>
            );
        case State.ShowRide:
            return (
                <div className="show-ride">
                    <h2>Your Passengers Are</h2>
                    <ul>
                        {
                            riders.map(rider => <h3>{rider}</h3>)
                        }
                    </ul>
                </div>
            );
        default:
            return;
    }
};
