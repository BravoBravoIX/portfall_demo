/**
 * This file maps MQTT messages to inject IDs.
 * It evaluates message attributes against the trigger conditions
 * defined in the injects.json file.
 */

import injectsConfig from './injects.json';

/**
 * Evaluates if a message matches a given trigger condition
 * @param {Object} message - The MQTT message to check
 * @param {string} triggerExpr - The trigger expression from injects.json
 * @returns {boolean} - Whether the message matches the trigger
 */
function evaluateTrigger(message, triggerExpr) {
  // Early return for invalid inputs
  if (!message || !message.command || !triggerExpr) {
    return false;
  }

  // Extract common variables from message
  const { command, parameters, topic } = message;
  const { dashboard, change, target_ships, subject, to, content, headline, interviewee } = parameters || {};
  
  // Create a context for evaluation
  const context = {
    command,
    dashboard,
    change,
    target_ships: target_ships || [],
    subject,
    to: to || [],
    content,
    headline,
    interviewee,
    topic
  };

  try {
    // Handle special cases that can't be directly evaluated
    if (triggerExpr.includes("target_ships includes")) {
      // For "includes" checks, we need special handling
      if (triggerExpr.includes("target_ships includes 'Ship_Alpha'")) {
        return command === 'update_dashboard' && 
               dashboard === 'ais' && 
               change === 'hide_ship' && 
               Array.isArray(target_ships) && 
               target_ships.includes('Ship_Alpha');
      }
    } else {
      // For simple equality checks
      const conditions = triggerExpr.split(' && ');
      return conditions.every(condition => {
        const [left, op, right] = condition.trim().split(/\s+(.+==.+)\s+/);
        
        // Handle direct equality
        if (condition.includes('==')) {
          const [varName, value] = condition.split('==').map(s => s.trim());
          const actualValue = context[varName];
          const expectedValue = value.replace(/['"]/g, ''); // Remove quotes
          return String(actualValue) === expectedValue;
        }
        
        // Default to false for unhandled conditions
        return false;
      });
    }
  } catch (error) {
    console.error("Error evaluating trigger:", error);
    return false;
  }
  
  return false;
}

/**
 * Determines which inject ID corresponds to a given MQTT message
 * @param {Object} message - The MQTT message to check
 * @returns {string|null} - The matching inject ID or null if no match
 */
export function getInjectId(message) {
  // Simple cases first
  if (!message || !message.command) {
    return null;
  }

  const { command, parameters, topic } = message;
  
  console.log("Checking inject mapping for:", { command, parameters, topic });

  // For simplicity and reliability, let's handle the most common cases directly
  // START SCENARIO
  if (command === 'start_scenario') {
    return 'INJ_START';
  }

  // DASHBOARD UPDATES
  if (command === 'update_dashboard' && parameters) {
    const { dashboard, change, target_ships, headline, interviewee, content } = parameters;

    // AIS Dashboard: Ship Alpha disappears
    if (dashboard === 'ais' && change === 'hide_ship' && 
        Array.isArray(target_ships) && target_ships.includes('Ship_Alpha')) {
      return 'INJ001';
    }

    // CCTV Dashboard: Blackout
    if (dashboard === 'cctv' && change === 'trigger_blackout') {
      return 'INJ003';
    }

    // Media Dashboard: Tweet about GPS drift
    if (dashboard === 'media' && change === 'publish_tweet') {
      return 'INJ006';
    }

    // AIS Dashboard: All ships disappear
    if (dashboard === 'ais' && change === 'hide_all_ships') {
      return 'INJ007';
    }

    // Container Dashboard: Configuration manipulation
    if (dashboard === 'container' && change === 'log_config_manipulation') {
      return 'INJ009';
    }

    // Media Dashboard: News about sabotage
    if (dashboard === 'media' && change === 'publish_news') {
      return 'INJ011';
    }

    // Media Dashboard: CEO interview
    if (dashboard === 'media' && change === 'air_interview') {
      return 'INJ016';
    }
  }

  // EMAIL MESSAGES
  if (command === 'send_email' && parameters) {
    const { subject } = parameters;

    // Match based on email subject - be more lenient with matching
    if (subject) {
      if (subject.includes('Delayed Packet')) return 'INJ002';
      if (subject.includes('Vendor Email') || subject.includes('Vendor Leak')) return 'INJ005';
      if (subject.includes('Past Vendor') || subject.includes('Vendor Incidents')) return 'INJ010';
      if (subject.includes('Insurer')) return 'INJ013';
      if (subject.includes('Journalist')) return 'INJ014B';
      if (subject.includes('Government')) return 'INJ015';
    }
  }

  // Try the more complex evaluation as a fallback
  for (const [injectId, injectData] of Object.entries(injectsConfig)) {
    if (evaluateTrigger(message, injectData.trigger)) {
      return injectId;
    }
  }

  // Log unmatched messages for debugging
  console.log("Unmatched message:", message);
  
  // No matching inject found
  return null;
}