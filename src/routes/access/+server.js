import { redirect } from '@sveltejs/kit';
import redisClient from '$lib/redis.js';

export async function GET({ request }) {
    const MAX_ACCESS = 5;

    // Obtener identificadores únicos
    const ip = request.headers.get('x-forwarded-for') || request.remoteAddress;
    const userAgent = request.headers.get('user-agent');
    const uniqueId = `${ip}-${userAgent}`; // Identificador único por usuario

    // Verificar si ya accedió
    const hasAccessed = await redisClient.exists(`user:${uniqueId}`);

    if (hasAccessed) {
        throw redirect(302, '/accessed');
    }

    // Incrementar contador global
    const currentCount = await redisClient.incr('access_count');

    if (currentCount > MAX_ACCESS) {
        throw redirect(302, '/full');
    }

    // Registrar que este usuario ya accedió
    await redisClient.set(`user:${uniqueId}`, '1', { EX: 86400 }); // EX = segundos

    throw redirect(302, '/preview');
}