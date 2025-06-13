const WebSocket = require('ws');
const redisClient = require('./services/redisClient');

const wss = new WebSocket.Server({ port: 8081 });

async function sendInjectHistory(ws) {
    const history = await redisClient.getInjectHistory();
    console.log(`Sending ${history.length} historical injects to new client`);

    // Send newest first
    history.reverse().forEach(inject => {
        ws.send(JSON.stringify(inject));
    });
}

wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');

    // On connect → send inject history immediately
    sendInjectHistory(ws);

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

redisClient.connectRedis();

// Subscribe to live injects → forward to clients
redisClient.subscribe('injects', (inject) => {
    console.log('Received inject from Redis:', inject);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(inject));
        }
    });
});

console.log('WebSocket server running on ws://localhost:8081');
