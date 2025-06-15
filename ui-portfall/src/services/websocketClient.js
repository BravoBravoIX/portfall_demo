let socket;
let listeners = [];
let reconnectTimer = null;

export function connectWebSocket() {
    // Clean up any existing socket
    if (socket) {
        console.log("Cleaning up existing WebSocket before reconnecting");
        socket.onclose = null; // Remove the reconnect handler
        socket.close();
    }

    // Clean up any existing reconnect timer
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    // Use dynamic host detection like MQTT client
    const host = window.location.hostname;
    socket = new WebSocket(`ws://${host}:8081`);

    socket.onopen = () => {
        console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
        try {
            const inject = JSON.parse(event.data);
            listeners.forEach((cb) => cb(inject));
        } catch (error) {
            console.error("Error handling WebSocket message:", error);
        }
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected");
        // Create reconnect timer
        reconnectTimer = setTimeout(() => {
            console.log("Attempting to reconnect WebSocket...");
            connectWebSocket();
        }, 3000);
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
}

export function disconnectWebSocket() {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    
    if (socket) {
        // Remove the automatic reconnect handler
        socket.onclose = null;
        socket.close();
        socket = null;
        console.log("WebSocket manually disconnected");
    }
    
    // Clear all listeners when explicitly disconnecting
    listeners = [];
}

export function onInjectReceived(callback) {
    if (typeof callback !== 'function') {
        console.error("Invalid callback provided to onInjectReceived");
        return;
    }
    listeners.push(callback);
    return callback; // Return the callback for easier removal
}

export function removeListener(callback) {
    const initialLength = listeners.length;
    listeners = listeners.filter((cb) => cb !== callback);
    
    if (initialLength === listeners.length) {
        console.warn("Failed to remove listener - callback not found");
    }
}

export function getConnectionStatus() {
    if (!socket) return 'disconnected';
    return socket.readyState === WebSocket.OPEN ? 'connected' : 
           socket.readyState === WebSocket.CONNECTING ? 'connecting' : 'disconnected';
}