import { useSearchParams } from "react-router-dom";
import "./CreateEvent.css";

export function ViewEventPage(props) {
    const [searchParams] = useSearchParams();
    let rideId = searchParams.get("r")
    
    return (
        <div>
            <p>Hello the from View Event Page</p>
            <p>You are viewing the ride {rideId}</p>
        </div>
    )
}