// test-redis.js

import { createClient } from 'redis';

// Usa tu URL completa de Redis desde .env
const client = createClient({
    url: process.env.REDIS_URL || 'redis://default:ZbfVKew0VAo6491HZouYcN2wwzOrRra2@redis-18982.c90.us-east-1-3.ec2.redns.redis-cloud.com:18982'
});

client.on('error', (err) => {
    console.error('❌ Error conectando a Redis:', err.message);
});

client.on('connect', () => {
    console.log('🔌 Conectado a Redis');
});

async function testConnection() {
    try {
        await client.connect();

        // Prueba incrementando el contador
        const count = await client.incr('test_connection_counter');

        console.log(`✅ Conexión exitosa`);
        console.log(`🔢 Contador de pruebas: ${count}`);

        // Limpia el contador de prueba
        if (count === 1) {
            await client.expire('test_connection_counter', 10); // borra en 10 segundos
        }

        await client.quit();
        console.log('👋 Conexión cerrada');
    } catch (err) {
        console.error('❌ Error durante la prueba:', err.message);
    }
}

testConnection();