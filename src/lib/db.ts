import { createPool } from '@vercel/postgres';
import { env } from '$env/dynamic/private';

export function addLocation(sessionId: string, lat: number, long: number, isGpsLocation: boolean, message: string | undefined, tagNumber: number | undefined): void {
    const databasePool = createPool({ connectionString: env.POSTGRES_URL });
    databasePool.connect().then(() => {
        databasePool.sql`INSERT INTO entries (session_id, is_gps, latitude, longitude, message, tag_number) VALUES (${sessionId}, ${isGpsLocation}, ${lat}, ${long}, ${message}, ${tagNumber})`;
    }).catch(() => {
        console.log("Adding location did not succeed");
    }).finally(() => {
        databasePool.end();
    });
}
