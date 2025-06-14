import { createClient } from 'redis';
import { env } from '$env/dynamic/private';

// Usa una variable de entorno para la conexión
const client = createClient({
    url: env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => {
    console.error('❌ Error conectando a Redis:', err);
});

await client.connect();

// Inicializa el contador si no existe
const count = await client.get('access_count');
if (count === null) {
    await client.set('access_count', 0);
}

export default client;