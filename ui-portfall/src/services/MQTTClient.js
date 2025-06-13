import mqtt from 'mqtt';

class MQTTClient {
  constructor() {
    this.client = null;
    this.connectCallbacks = [];
    this.disconnectCallbacks = [];
    this.messageCallbacks = [];
    this.connected = false;
    this.clientId = `portfall_${Math.random().toString(16).slice(2, 10)}`;
    
    // Store a timestamp for when we last saw specific message types
    this.lastMessageTimestamps = {
      'hide_all_ships': 0,
      'show_all_ships': 0
    };
  }

  isConnected() {
    return this.connected && this.client && this.client.connected;
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.isConnected()) {
        console.log('[MQTTClient] Already connected, reusing connection');
        resolve();
        return;
      }

      // Disconnect existing client if there is one
      if (this.client) {
        this.disconnect();
      }

      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const host = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname;
      const port = 9001;
      const connectUrl = `${protocol}://${host}:${port}`;

      console.log(`[MQTTClient] Connecting to MQTT broker at ${connectUrl} with clientId ${this.clientId}`);

      // Use a consistent client ID per instance to avoid duplicate connections
      this.client = mqtt.connect(connectUrl, {
        clientId: this.clientId,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
        keepalive: 60
      });

      this.client.on('connect', () => {
        console.log(`[MQTTClient] MQTT connected with client ID: ${this.clientId}`);
        this.connected = true;
        this.connectCallbacks.forEach(callback => {
          try {
            callback();
          } catch (error) {
            console.error('[MQTTClient] Error in connect callback:', error);
          }
        });
        resolve();
      });

      this.client.on('error', (err) => {
        console.error('[MQTTClient] MQTT connection error:', err);
        this.connected = false;
        reject(err);
      });

      this.client.on('close', () => {
        console.log('[MQTTClient] MQTT connection closed');
        this.connected = false;
        this.disconnectCallbacks.forEach(callback => {
          try {
            callback();
          } catch (error) {
            console.error('[MQTTClient] Error in disconnect callback:', error);
          }
        });
      });

      this.client.on('reconnect', () => {
        console.log('[MQTTClient] Attempting to reconnect to MQTT broker');
      });

      this.client.on('message', (topic, message) => {
        try {
          // Log raw message at debug level
          const isDevelopment = process.env.NODE_ENV === 'development';
          if (isDevelopment) {
            console.log(`[MQTTClient] Raw message received on ${topic}:`, message.toString());
          }
          
          // Parse the message
          const parsedMessage = JSON.parse(message.toString());
          
          // Special handling for hide_all_ships and show_all_ships messages
          if (parsedMessage.command === 'update_dashboard' && 
              parsedMessage.parameters?.dashboard === 'ais') {
            
            const change = parsedMessage.parameters.change;
            
            // Log these message types with high visibility
            if (change === 'hide_all_ships' || change === 'show_all_ships') {
              console.log(`[MQTTClient] *** IMPORTANT *** Received ${change} message`);
              
              // Record when we last saw this message type
              this.lastMessageTimestamps[change] = Date.now();
              
              // Extra handling for hide_all_ships to ensure it works
              if (change === 'hide_all_ships') {
                console.log('[MQTTClient] Adding extra safeguard for hide_all_ships message');
                // Force the hide_all_ships parameter to be visible in logs
                console.log(`[MQTTClient] Message details: command=${parsedMessage.command}, dashboard=${parsedMessage.parameters?.dashboard}, change=${change}`);
              }
            }
          }
          
          // Call all callbacks with the parsed message
          if (isDevelopment) {
            console.log(`[MQTTClient] Calling ${this.messageCallbacks.length} registered callbacks`);
          }
          
          this.messageCallbacks.forEach(callback => {
            try {
              callback(topic, parsedMessage);
            } catch (callbackError) {
              console.error('[MQTTClient] Error in message callback:', callbackError);
            }
          });
        } catch (error) {
          console.error('[MQTTClient] Error parsing MQTT message:', error, 'Raw message:', message.toString());
        }
      });
    });
  }

  subscribe(topic) {
    if (!this.isConnected()) {
      console.error(`Cannot subscribe to topic ${topic} - MQTT client not connected`);
      return Promise.reject(new Error('MQTT client not connected'));
    }
    
    return new Promise((resolve, reject) => {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to topic ${topic}:`, err);
          reject(err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
          resolve();
        }
      });
    });
  }

  publish(topic, message) {
    if (!this.isConnected()) {
      console.error(`Cannot publish to topic ${topic} - MQTT client not connected`);
      return Promise.reject(new Error('MQTT client not connected'));
    }
    
    if (typeof message === 'object') {
      message = JSON.stringify(message);
    }
    
    return new Promise((resolve, reject) => {
      this.client.publish(topic, message, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  onConnect(callback) {
    if (typeof callback !== 'function') {
      console.error('[MQTTClient] Invalid callback provided to onConnect');
      return null;
    }
    this.connectCallbacks.push(callback);
    return callback; // Return for easier removal
  }

  onDisconnect(callback) {
    if (typeof callback !== 'function') {
      console.error('[MQTTClient] Invalid callback provided to onDisconnect');
      return null;
    }
    this.disconnectCallbacks.push(callback);
    return callback; // Return for easier removal
  }

  onMessage(callback) {
    if (typeof callback !== 'function') {
      console.error('[MQTTClient] Invalid callback provided to onMessage');
      return null;
    }
    this.messageCallbacks.push(callback);
    return callback; // Return for easier removal
  }

  removeConnectCallback(callback) {
    const initialLength = this.connectCallbacks.length;
    this.connectCallbacks = this.connectCallbacks.filter(cb => cb !== callback);
    return initialLength !== this.connectCallbacks.length;
  }

  removeDisconnectCallback(callback) {
    const initialLength = this.disconnectCallbacks.length;
    this.disconnectCallbacks = this.disconnectCallbacks.filter(cb => cb !== callback);
    return initialLength !== this.disconnectCallbacks.length;
  }

  removeMessageCallback(callback) {
    const initialLength = this.messageCallbacks.length;
    this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    return initialLength !== this.messageCallbacks.length;
  }

  removeAllCallbacks() {
    this.connectCallbacks = [];
    this.disconnectCallbacks = [];
    this.messageCallbacks = [];
  }

  disconnect() {
    if (this.client) {
      this.client.end(true, () => {
        console.log('[MQTTClient] MQTT client disconnected');
      });
      this.client = null;
      this.connected = false;
    }
  }
}

export default MQTTClient;