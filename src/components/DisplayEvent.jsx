import { Car } from "./Car";
import "./DisplayEvent.css";
import {useRef, useState, useEffect} from 'react';

const Line = () => {
    return <div className="parking-line"></div>
}

export function DisplayEvent(props) {
    let {event, setParentDriver, isRiderNameEntered} = props;

    const contRef = useRef(null);
    const [contWidth, setContWidth] = useState(100);

    useEffect(() => {
        setContWidth(contRef.current.getBoundingClientRect().width);
    }, [contRef])

    return (
        <div className="parking-lot" ref={contRef}>
            {event.cars.map(car =>
                <>
                <Line />
                    <Car
                        car={car}
                        contWidth={contWidth}
                        setParentSelectedDriver={setParentDriver}
                        isRiderNameEntered={isRiderNameEntered}
                    />
                </>
            )}
            <Line />
            {event.cars.length===0?
                <>
                    <div style={{height: "170px"}} />
                    <Line />
                    </>: null}
        </div>
    )
};
