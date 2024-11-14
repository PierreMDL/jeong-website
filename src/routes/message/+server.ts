import { addLocation } from '$lib/db.js';
import { validate as validateV4uuid, v4 as createRandomV4uuid } from 'uuid';


type FormData = {
    lat?: string;
    long?: string;
    message?: string;
    tagNumber?: string;
    sessionId?: string;
}

export async function POST({ request }) {
    const { lat, long, message, tagNumber, sessionId }: FormData = await request.json();
    let safeSessionId = createRandomV4uuid();
    // TODO get from IP address
    let safeLat = Number.parseFloat('0');
    let safeLong = Number.parseFloat('0');
    let isGpsLocation = false;

    let safeMessage: string | undefined;
    let safeTagNumber: number | undefined;

    if (lat && long) {
        safeLat = Number.parseFloat(lat);
        safeLong = Number.parseFloat(long);
        isGpsLocation = true;
    }
    if (tagNumber) {
        safeTagNumber = Number.parseInt(tagNumber);
    }
    if (sessionId && validateV4uuid(sessionId)) {
        safeSessionId = sessionId;
    }
    addLocation(safeSessionId, safeLat, safeLong, isGpsLocation, message, safeTagNumber);

    return new Response(JSON.stringify({ sessionId: safeSessionId }), { status: 201 });
}
