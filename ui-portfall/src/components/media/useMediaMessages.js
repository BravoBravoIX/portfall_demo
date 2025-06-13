import { useState, useEffect } from 'react';
import { useGlobalState } from '../../state/globalState';

export default function useMediaMessages() {
  const { getInjectsForDashboard } = useGlobalState();
  const mediaInjects = getInjectsForDashboard('media');
  
  const [mediaItems, setMediaItems] = useState([
    {
      id: 1,
      type: 'tweet',
      title: "Tweet: 'Why are ships disappearing?!'",
      timestamp: 'T+35',
      imageSrc: '/gps_tweet.png',
      source: '@localwatch',
      visible: false
    },
    {
      id: 2,
      type: 'image',
      title: 'News Headline: Sabotage at Southgate?',
      timestamp: 'T+75',
      imageSrc: '/sabotage_news.png',
      source: 'ABC News',
      visible: false
    },
    {
      id: 3,
      type: 'video',
      title: 'BREAKING: Unrest Reported at Southgate Port',
      timestamp: 'T+105',
      videoSrc: '/port_news.mp4',
      source: 'Channel 7',
      visible: false
    },
    {
      id: 4,
      type: 'video',
      title: 'CEO Interview on Southgate Incident',
      timestamp: 'T+110',
      videoSrc: '/ceo_interview.mp4',
      source: 'Channel 7',
      visible: false
    }
  ]);
  
  const [timeline, setTimeline] = useState([]);
  
  // Process media injects
  useEffect(() => {
    if (mediaInjects.length === 0) return;
    
    // Create copies of current state
    const updatedMediaItems = [...mediaItems];
    const updatedTimeline = [...timeline];
    
    // Process each inject in chronological order
    mediaInjects.forEach(inject => {
      const { command, parameters, receivedAt } = inject;
      
      if (command === 'update_dashboard' && parameters?.dashboard === 'media') {
        const { change, media_id, media_type, title, source, url, content, headline, interviewee, timestamp_label } = parameters || {};
        
        // Format timestamp for timeline
        const eventTime = new Date(receivedAt).toLocaleTimeString();
        
        // Handle different media types based on the inject format
        
        // Handle tweet publications (first media item)
        if (change === 'publish_tweet') {
          // Display the tweet media item (id: 1)
          const tweetIndex = updatedMediaItems.findIndex(item => item.id === 1);
          if (tweetIndex >= 0) {
            updatedMediaItems[tweetIndex].visible = true;
            
            // Add to timeline
            updatedTimeline.push({
              id: Date.now() + Math.random(),
              timestamp: eventTime,
              event: `Tweet published: ${content || 'Why are ships disappearing?!'}`,
              mediaId: 1
            });
          }
        }
        
        // Handle news publications with "Sabotage" headline (second media item)
        if (change === 'publish_news' && headline?.includes('Sabotage')) {
          // Display the sabotage news media item (id: 2)
          const newsIndex = updatedMediaItems.findIndex(item => item.id === 2);
          if (newsIndex >= 0) {
            updatedMediaItems[newsIndex].visible = true;
            
            // Add to timeline
            updatedTimeline.push({
              id: Date.now() + Math.random(),
              timestamp: eventTime,
              event: `News published: ${headline}`,
              mediaId: 2
            });
          }
        }
        
        // Handle breaking news about unrest (third media item)
        if (change === 'publish_news' && headline?.includes('Unrest')) {
          // Display the unrest news media item (id: 3)
          const breakingNewsIndex = updatedMediaItems.findIndex(item => item.id === 3);
          if (breakingNewsIndex >= 0) {
            updatedMediaItems[breakingNewsIndex].visible = true;
            
            // Add to timeline
            updatedTimeline.push({
              id: Date.now() + Math.random(),
              timestamp: eventTime,
              event: `Breaking news published: ${headline}`,
              mediaId: 3
            });
          }
        }
        
        // Handle CEO interview (fourth media item)
        if (change === 'air_interview' && interviewee === 'CEO') {
          // Display the CEO interview media item (id: 4)
          const interviewIndex = updatedMediaItems.findIndex(item => item.id === 4);
          if (interviewIndex >= 0) {
            updatedMediaItems[interviewIndex].visible = true;
            
            // Add to timeline
            updatedTimeline.push({
              id: Date.now() + Math.random(),
              timestamp: eventTime,
              event: `Interview aired: ${interviewee} Interview on Southgate Incident`,
              mediaId: 4
            });
          }
        }
        
        // Keep the original handlers for backward compatibility
        
        // Handle media visibility changes
        if (change === 'show_media' && media_id) {
          // Check if media already exists by id
          const existingMediaIndex = updatedMediaItems.findIndex(item => item.id.toString() === media_id.toString());
          
          if (existingMediaIndex >= 0) {
            // Update existing media item
            updatedMediaItems[existingMediaIndex] = {
              ...updatedMediaItems[existingMediaIndex],
              visible: true
            };
            
            // Add to timeline
            updatedTimeline.push({
              id: Date.now() + Math.random(),
              timestamp: eventTime,
              event: `Media item shown: ${updatedMediaItems[existingMediaIndex].title}`,
              mediaId: media_id
            });
          }
        }
        
        // Handle hiding media
        if (change === 'hide_media' && media_id) {
          // Find media item
          const existingMediaIndex = updatedMediaItems.findIndex(item => item.id.toString() === media_id.toString());
          
          if (existingMediaIndex >= 0) {
            // Update visibility
            updatedMediaItems[existingMediaIndex] = {
              ...updatedMediaItems[existingMediaIndex],
              visible: false
            };
            
            // Add to timeline
            updatedTimeline.push({
              id: Date.now() + Math.random(),
              timestamp: eventTime,
              event: `Media item hidden: ${updatedMediaItems[existingMediaIndex].title}`,
              mediaId: media_id
            });
          }
        }
        
        // Handle new media
        if (change === 'add_media' && media_type && title && url) {
          // Generate a unique ID if none provided
          const newId = media_id || Date.now();
          
          // Create new media item
          const newMediaItem = {
            id: newId,
            type: media_type,
            title,
            timestamp: timestamp_label || 'Now',
            source: source || 'Unknown',
            visible: true
          };
          
          // Add appropriate source URL based on type
          if (media_type === 'video') {
            newMediaItem.videoSrc = url;
          } else {
            newMediaItem.imageSrc = url;
          }
          
          // Add to media items
          updatedMediaItems.push(newMediaItem);
          
          // Add to timeline
          updatedTimeline.push({
            id: Date.now() + Math.random(),
            timestamp: eventTime,
            event: `New media added: ${title}`,
            mediaId: newId
          });
        }
      }
    });
    
    // Keep timeline sorted by timestamp (newest first)
    const sortedTimeline = updatedTimeline
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 50);
    
    // Update state
    setMediaItems(updatedMediaItems);
    setTimeline(sortedTimeline);
    
  }, [mediaInjects]);
  
  // Return only visible media items and all data
  return {
    mediaItems: mediaItems.filter(item => item.visible),
    allMediaItems: mediaItems,
    timeline,
    raw: mediaInjects
  };
}