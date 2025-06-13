import React from 'react';
import MediaFeedItemCard from '../components/media/MediaFeedItemCard';
import MediaTimelineCard from '../components/media/MediaTimelineCard';
import MediaMQTTCard from '../components/media/MediaMQTTCard';
import useMediaMessages from '../components/media/useMediaMessages';

export default function MediaPage() {
  // Use media messages hook to get filtered data
  const { mediaItems } = useMediaMessages();
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Media & Social Feed</h2>

      {/* Timeline showing when media injects occur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MediaTimelineCard />
        <MediaMQTTCard />
      </div>

      {/* Injected media items */}
      {mediaItems.map((item) => (
        <MediaFeedItemCard
          key={item.id}
          type={item.type}
          title={item.title}
          timestamp={item.timestamp}
          imageSrc={item.imageSrc}
          videoSrc={item.videoSrc}
          source={item.source}
        />
      ))}
    </div>
  );
}