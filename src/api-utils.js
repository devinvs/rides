const apiBase = "";

export async function getEvent(eventId) {
    try {
        const response = await fetch(`${apiBase}/events/${eventId}`)
        return response.json();
    }
    catch (error) {
        return error;
    }
}
