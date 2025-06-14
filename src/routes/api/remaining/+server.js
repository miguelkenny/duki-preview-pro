import { json } from '@sveltejs/kit';
import redisClient from '$lib/redis.js';
import { env } from '$env/dynamic/private';

export async function GET() {
    const MAX_ACCESS = parseInt(env.MAX_ACCESS);

    // Obtener el número actual de accesos
    const currentCount = await redisClient.get('access_count');
    const remaining = MAX_ACCESS - parseInt(currentCount || '0');

    return json({ total: MAX_ACCESS, current: parseInt(currentCount || '0'), remaining });
}