const { createClient } = require('redis');

const redis = createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:6379`
});

redis.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
    if (!redis.isOpen) {
        await redis.connect();
        console.log("Connected to Redis!");
    }
}

async function publish(channel, message) {
    await redis.publish(channel, JSON.stringify(message));
}

async function subscribe(channel, onMessage) {
    const sub = redis.duplicate();
    await sub.connect();
    await sub.subscribe(channel, (message) => {
        onMessage(JSON.parse(message));
    });
}

async function addInjectToHistory(inject) {
    await redis.lPush('inject_history', JSON.stringify(inject));
    await redis.lTrim('inject_history', 0, 499); // Keep last 500 injects
}

async function getInjectHistory() {
    const items = await redis.lRange('inject_history', 0, -1);
    return items.map(str => JSON.parse(str));
}

module.exports = {
    connectRedis,
    publish,
    subscribe,
    addInjectToHistory,
    getInjectHistory
};
