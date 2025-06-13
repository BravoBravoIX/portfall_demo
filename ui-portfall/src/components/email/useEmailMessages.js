import React, { useState, useEffect, useRef } from 'react';
import { useGlobalState } from '../../state/globalState';
import { useAuth } from '../../auth/AuthContext';

export default function useEmailMessages(userEmail = null) {
  // Get current user info if no specific email provided
  const { user } = useAuth();
  
  // Use provided userEmail or get from current user role
  const currentUserEmail = userEmail || (user?.config?.email || '');
  const { injects } = useGlobalState();
  
  // Filter for email-specific injects
  const emailInjects = React.useMemo(() => {
    return injects.filter(inject => 
      inject.dashboard === 'email' || 
      inject.dashboard === 'mail' ||
      inject.command === 'send_email' ||
      (inject.parameters && (
        inject.parameters.type === 'email' || 
        inject.parameters.action === 'send_email'
      )) ||
      (inject.topic && inject.topic.includes('email'))
    );
  }, [injects]);
  
  // State for email client
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Email folders
  const folders = [
    { id: 'inbox', name: 'Inbox', unread: unreadCount },
    { id: 'sent', name: 'Sent', unread: 0 },
    { id: 'drafts', name: 'Drafts', unread: 0 },
    { id: 'trash', name: 'Trash', unread: 0 }
  ];
  
  // Keep a reference to already processed inject IDs to prevent duplicates
  const processedInjects = useRef(new Set());
  const emailProcessedSet = useRef(new Set());
  const resetRef = useRef(false);
  
  // Initialize or reset on first load
  useEffect(() => {
    if (!resetRef.current) {
      console.log('RESET: Clearing email processing state');
      processedInjects.current.clear();
      emailProcessedSet.current.clear();
      setEmails([]);
      setSelectedEmail(null);
      resetRef.current = true;
    }
  }, []);

  // Helper to check if an email should be shown to the current user
  const isEmailForUser = (email) => {
    // Admin sees all emails
    if (user?.roles?.includes('admin')) {
      return true;
    }
    
    // No filtering if no user email
    if (!currentUserEmail) {
      return true;
    }
    
    // Extract recipients and normalize
    const normalizedUserEmail = currentUserEmail.toLowerCase().trim();
    
    // Check recipient fields (handle both string and array formats)
    let recipients = [];
    if (typeof email.to === 'string') {
      recipients = email.to.split(',').map(r => r.trim().toLowerCase());
    } else if (Array.isArray(email.to)) {
      recipients = email.to.map(r => r.toLowerCase().trim());
    }
    
    // Check for direct match with user email in TO field
    if (recipients.includes(normalizedUserEmail)) {
      return true;
    }
    
    // Also check CC field, if present
    let ccRecipients = [];
    if (typeof email.cc === 'string') {
      ccRecipients = email.cc.split(',').map(r => r.trim().toLowerCase());
    } else if (Array.isArray(email.cc)) {
      ccRecipients = email.cc.map(r => r.toLowerCase().trim());
    }
    
    // Check if user's email is in the CC list
    if (ccRecipients.includes(normalizedUserEmail)) {
      return true;
    }
    
    // Check for role-based matches
    const roleKeywords = {
      'ceo': 'executive',
      'legal': 'legal',
      'tech': 'technical',
      'media': 'media',
      'operations': 'operations',
      'coordinator': 'incident'
    };
    
    // Get user's role
    const currentRole = user?.currentRole || '';
    
    // Check if any recipient contains role keywords that match the user's role
    for (const recipient of recipients) {
      for (const [keyword, role] of Object.entries(roleKeywords)) {
        if (recipient.includes(keyword) && currentRole.includes(role)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Process email injects
  useEffect(() => {
    if (emailInjects.length === 0) return;
    
    console.log(`Processing ${emailInjects.length} email injects`);
    // Count unprocessed injects
    const unprocessedCount = emailInjects.filter(i => !processedInjects.current.has(i.id)).length;
    console.log(`${unprocessedCount} unprocessed injects found`);
    
    // Start with a fresh copy - we'll rebuild the entire email list to avoid duplicates
    let allEmails = [];
    const emailIdsSet = new Set();
    
    // First, add existing emails that we've already processed 
    // (prevents losing read status)
    emails.forEach(email => {
      if (!emailIdsSet.has(email.id)) {
        emailIdsSet.add(email.id);
        allEmails.push(email);
      }
    });
    
    let emailsAdded = 0;
    
    // Process each inject
    emailInjects.forEach(inject => {
      // Generate a stable ID based on inject data to avoid duplication
      const injectId = inject.id || '';
      let emailId = '';
      
      try {
        // Skip if we've already processed this inject
        if (processedInjects.current.has(injectId)) {
          return;
        }
        
        // Mark as processed to prevent duplicates
        processedInjects.current.add(injectId);
        
        const { command, parameters, receivedAt, topic } = inject;
        
        // Generate a unique email ID based on content
        const timestamp = receivedAt || Date.now();
        const subject = parameters?.subject || '';
        const from = parameters?.from || '';
        emailId = `email-${timestamp}-${subject.substring(0, 10)}-${from.substring(0, 10)}`;
        
        // If we've already processed a similar email (same timestamp, subject, from),
        // then skip this one
        if (emailProcessedSet.current.has(emailId)) {
          console.log(`Skipping similar email already processed: ${emailId}`);
          return;
        }
        
        // Create the email
        let emailToAdd = null;
        
        if (command === 'send_email') {
          // Direct send_email command
          const { 
            from, 
            to, 
            subject, 
            body, 
            attachments 
          } = parameters || {};
          
          // Create new email record
          emailToAdd = {
            id: emailId,
            timestamp: new Date(timestamp).toLocaleTimeString(),
            from: from || 'system@portfall.local',
            to: Array.isArray(to) ? to.join(', ') : to || 'user@portfall.local',
            cc: parameters.cc ? (Array.isArray(parameters.cc) ? parameters.cc.join(', ') : parameters.cc) : '',
            subject: subject || '(No Subject)',
            body: body || '',
            attachments: attachments || [],
            receivedAt: timestamp,
            folder: 'inbox',
            read: false
          };
        }
        else if (command === 'update_dashboard') {
          const { 
            change, 
            from, 
            to, 
            subject, 
            body, 
            attachments 
          } = parameters || {};
          
          // Handle email events
          if (change === 'send_email' || change === 'email' || parameters?.type === 'email') {
            // Create new email record
            emailToAdd = {
              id: emailId,
              timestamp: new Date(timestamp).toLocaleTimeString(),
              from: from || 'system@portfall.local',
              to: Array.isArray(to) ? to.join(', ') : to || 'user@portfall.local',
              cc: parameters.cc ? (Array.isArray(parameters.cc) ? parameters.cc.join(', ') : parameters.cc) : '',
              subject: subject || '(No Subject)',
              body: body || '',
              attachments: attachments || [],
              receivedAt: timestamp,
              folder: 'inbox',
              read: false
            };
          }
        }
        // Special case for email topic-based emails regardless of command
        else if (topic && topic.includes('email')) {
          // Extract what we can from parameters
          const { 
            from, 
            to, 
            subject, 
            body, 
            message, 
            content, 
            attachments 
          } = parameters || {};
          
          // Create new email record with best-effort parameter extraction
          emailToAdd = {
            id: emailId,
            timestamp: new Date(timestamp).toLocaleTimeString(),
            from: from || 'system@portfall.local',
            to: Array.isArray(to) ? to.join(', ') : to || 'user@portfall.local',
            cc: parameters.cc ? (Array.isArray(parameters.cc) ? parameters.cc.join(', ') : parameters.cc) : '',
            subject: subject || '(No Subject)',
            body: body || message || content || '',
            attachments: attachments || [],
            receivedAt: timestamp,
            folder: 'inbox',
            read: false
          };
        }
        
        // Add the new email if we created one and it's not already in our list
        if (emailToAdd && !emailIdsSet.has(emailToAdd.id)) {
          emailIdsSet.add(emailToAdd.id);
          emailProcessedSet.current.add(emailId);
          allEmails.push(emailToAdd);
          emailsAdded++;
        }
      } catch (error) {
        console.error(`Error processing email inject ${injectId}:`, error);
      }
    });
    
    // Only update state if we have added emails
    if (emailsAdded > 0) {
      console.log(`Added ${emailsAdded} new emails`);
      
      // Sort all emails by timestamp
      allEmails.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
      
      // Update state with the new email list
      setEmails(allEmails);
      
      // Apply role-based filtering
      const filtered = allEmails.filter(isEmailForUser);
      setFilteredEmails(filtered);
      
      // Update unread count based on filtered emails
      const newUnreadCount = filtered.filter(email => !email.read).length;
      setUnreadCount(newUnreadCount);
    }
  }, [emailInjects, emails]);
  
  // Apply filtering when emails or user changes
  useEffect(() => {
    const filtered = emails.filter(isEmailForUser);
    setFilteredEmails(filtered);
    
    // Update unread count
    const newUnreadCount = filtered.filter(email => !email.read).length;
    setUnreadCount(newUnreadCount);
  }, [emails, currentUserEmail, user?.currentRole]);
  
  // Handle email selection
  const selectEmail = (emailId) => {
    // Find the selected email
    const email = emails.find(e => e.id === emailId);
    if (email) {
      // Update email as read
      if (!email.read) {
        const updatedEmails = emails.map(e => {
          if (e.id === emailId) {
            return { ...e, read: true };
          }
          return e;
        });
        setEmails(updatedEmails);
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      // Set as selected
      setSelectedEmail(email);
    }
  };
  
  // Handle folder selection
  const selectFolder = (folderId) => {
    setSelectedFolder(folderId);
    setSelectedEmail(null);
  };
  
  // For debugging purposes
  const getState = () => {
    return {
      processedInjectCount: processedInjects.current.size,
      emailCount: emails.length,
      injectCount: emailInjects.length
    };
  };
  
  return {
    emails: filteredEmails, // Return filtered emails instead of all emails
    allEmails: emails, // Still provide access to all emails if needed
    folders,
    selectedFolder,
    selectedEmail,
    selectEmail,
    selectFolder,
    unreadCount,
    getState,
    raw: emailInjects,
    currentUserEmail
  };
}