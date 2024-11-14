import { addLocation } from "$lib/db";
import { v4 as createRandomV4uuid } from "uuid";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ url, request }) => {
    const sessionId = createRandomV4uuid();
    // TODO get approximate location from client's IP address
    const safeLat = 0;
    const safeLong = 0;
    const isGpsLocation = false;
    const message = undefined;
    const tagNumber = url.searchParams.get('t');
    const safeTagNumber = tagNumber ? Number.parseInt(tagNumber) : undefined;
    addLocation(sessionId, safeLat, safeLong, isGpsLocation, message, safeTagNumber);

    return { sessionId: sessionId, tagNumber: safeTagNumber };
}
