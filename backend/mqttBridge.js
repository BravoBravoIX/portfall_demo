const mqtt = require('mqtt');
const { publish, connectRedis, addInjectToHistory } = require('./services/redisClient');
const emailService = require('./services/emailService');

// Connect to Redis
connectRedis();

// Connect to MQTT broker
const mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_BROKER || 'mqtt-broker'}:1883`);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');

    mqttClient.subscribe('ui_update/vm-ui', (err) => {
        if (err) {
            console.error('Failed to subscribe to MQTT topic:', err);
        } else {
            console.log('Subscribed to MQTT topic ui_update/vm-ui');
        }
    });
});

mqttClient.on('message', (topic, message) => {
    console.log(`MQTT Message received on ${topic}:`, message.toString());

    const parsed = JSON.parse(message.toString());

    const inject = {
        dashboard: parsed.parameters?.dashboard || 'general',
        ...parsed,
        receivedAt: new Date().toISOString()
    };

    publish('injects', inject).then(() => {
        console.log('Published inject to Redis:', inject);
    });

    addInjectToHistory(inject).then(() => {
        console.log('Saved inject to history');
    });

    // Handle email sending for send_email commands
    if (parsed.command === 'send_email' && parsed.parameters) {
        emailService.sendEmail(parsed.parameters).then(result => {
            if (result.success) {
                console.log('📧 Email sent via Gmail:', result);
            } else if (result.skipped) {
                console.log('📧 Email send skipped:', result.reason);
            }
        }).catch(err => {
            console.error('📧 Email service error:', err);
            // Don't let email errors break the simulation
        });
    }
});
