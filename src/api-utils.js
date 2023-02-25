export const apiBase = "";

export async function getEvent(eventId) {
    try {
        const response = await fetch(`${apiBase}/events/${eventId}`)
        return response.json();
    }
    catch (error) {
        return error;
    }
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
