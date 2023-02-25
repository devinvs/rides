import "./Car.css";

export function Car(props) {
    let car = props.car;
    let seatsRemaining = car.capacity - car.riders.length;
    const emptySeats = [];
    for (let i = 0; i < seatsRemaining; i++) {
        emptySeats.push(
            <button value="Join Car"></button>  
        )
    }

    return (
        <div >
            <p>{car.driver}</p>
            <div className="car">
                <ul className="riders">
                    <li>
                    </li>
                    {
                        car.riders.map(rider =>
                        <li className="rider">{rider}</li>)
                    }
                    {
                        emptySeats.map(emptySeat => 
                            <li className="empty-seat">
                                <button>Join Car</button>
                            </li>)
                    }
                </ul>
            </div>
        </div>
    )
}