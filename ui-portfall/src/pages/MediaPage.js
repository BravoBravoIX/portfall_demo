import React from 'react';
import MediaFeedItemCard from '../components/media/MediaFeedItemCard';
import useMediaMessages from '../components/media/useMediaMessages';

export default function MediaPage() {
  // Use media messages hook to get filtered data
  const { mediaItems } = useMediaMessages();
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Media & Social Feed</h2>


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