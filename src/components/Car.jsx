import { useEffect } from "react";
import { abbreviate } from "../util";
import "./Car.css";

export function Car(props) {
    let car = props.car;
    let seatsRemaining = car.capacity - car.riders.length;

    let seats = [];

    car.riders.forEach(rider => seats.push(
        <p className="rider">{abbreviate(rider)}</p>
    ));

    for (let i = 0; i < seatsRemaining; i++) {
        seats.push(<button className="empty-seat">Join</button>)
    }

    let renderedSeatsStruct = [[]];
    useEffect(() => {
        let parkingLotWidth = document.getElementById("parking-lot")
            .getBoundingClientRect().width;
        let lengthOfBlock = 55;
        let c = Math.floor(parkingLotWidth / lengthOfBlock);
        let n = car.capacity
        let nl = Math.floor(n / c);
        let numPerLine = Math.ceil(n / nl);
        
    
        let i = 0;
        seats.forEach(seat => {
            if (renderedSeatsStruct[i].length <= numPerLine) {
                renderedSeatsStruct[i].push(seat);
            }
            else {
                renderedSeatsStruct.push([seat]);
                i++;
            }
        })
        console.log(renderedSeatsStruct);

    });


    return (
        <div className="car">
            <p className="driver">{car.driver}</p>
            <div className="riders">
                {
                    renderedSeatsStruct.map((row, i) => 
                        <ul>
                            {
                                row.map((cell, i) =>
                                    <li>{cell}</li>
                            )}
                        </ul>
                )}
            </div>
        </div>
    )
}