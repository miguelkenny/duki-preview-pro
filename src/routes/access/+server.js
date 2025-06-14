import { redirect } from '@sveltejs/kit';
import redisClient from '$lib/redis.js';

export async function GET({ request }) {
    const MAX_ACCESS = 4500;

    // Obtener identificadores únicos
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    const userAgent = request.headers.get('user-agent');
    const uniqueId = `${ip}-${userAgent}`;

    console.log('🔍 IP:', ip);
    console.log('🧭 User-Agent:', userAgent);
    console.log('🧾 Unique ID:', uniqueId);

    // Verificar si ya accedió
    const hasAccessed = await redisClient.exists(`user:${uniqueId}`);
    if (hasAccessed) {
        console.log('🚫 Usuario ya accedió una vez');
        throw redirect(302, '/accessed');
    }

    // Incrementar contador global
    const currentCount = await redisClient.incr('access_count');
    console.log('🔢 Contador actual:', currentCount);

    if (currentCount > MAX_ACCESS) {
        console.log('🛑 Límite alcanzado');
        throw redirect(302, '/full');
    }

    // Registrar que este usuario ya accedió (con TTL de 24hs)
    await redisClient.set(`user:${uniqueId}`, '1', { EX: 86400 });

    console.log('✅ Acceso concedido');
    throw redirect(302, '/preview');
}