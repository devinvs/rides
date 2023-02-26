export const apiBase = "http://localhost:5000";

// Get the data for an event
export async function getEvent(eventId) {
    const res = await fetch(`${apiBase}/events/${eventId}`);
    return await res.json();
}

// Create a new event and returns the id of the event
export async function createEvent(name) {
    const data = {event_name: name}
    const res = await fetch(`${apiBase}/events`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data)
    });

    return await res.json();
}

// login
export async function login(eventId, name) {
    const res = await fetch(`${apiBase}/events/${eventId}/persons?name=${name}`, {
        method: "GET",
    });

    if (res.status == 404) {
         throw new Error("User doesn't Exist");
    }
    
    return await res.json();
}

// Join a car
export async function joinCar(eventId, rider, driver) {
    const data = { rider: rider, driver: driver };
    const res = await fetch(`${apiBase}/events/${eventId}/riders`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
    });

    return await res.json();
}

// Add a car to an event
export async function addCarToEvent(eventId, driverName, capacity) {
    const data = {
        driver: driverName,
        capacity: capacity
    };
    const res = await fetch(`${apiBase}/events/${eventId}/drivers`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
    });

    return await res.json();
}
