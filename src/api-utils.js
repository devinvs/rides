export const apiBase = "http://localhost:5000";

// Get the data for an event
export async function getEvent(eventId) {
    const res = await fetch(`${apiBase}/events/${eventId}`);
    return await res.json();
}

// Create a new event and returns the id of the event
export async function createEvent(name) {
    const data = {name: name}
    const res = await fetch(`${apiBase}/events`, {
        method: "POST",
        data: JSON.stringify(data)
    });

    return await res.json();
}

// Get the data for an event
export async function login(eventId) {
    const res = await fetch(`${apiBase}/events/${eventId}/join`);
    return await res.json();
}

// Join a car
export async function joinCar(eventId, driverName) {
    const data = { driver: driverName };
    const res = await fetch(`${apiBase}/events/${eventId}/riders`, {
      method: "POST",
      data: JSON.stringify(data),
    });

    return await res.json();
}