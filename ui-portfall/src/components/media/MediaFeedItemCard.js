import React from 'react';

export default function MediaFeedItemCard({ type, title, timestamp, imageSrc, videoSrc, source }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <h3 className="text-md font-semibold">{title}</h3>
      <p className="text-xs text-gray-500 mb-2">{timestamp} • {source}</p>

      {type === 'image' && (
        <div className="flex justify-center">
          <a href={imageSrc} target="_blank" rel="noopener noreferrer">
            <img
              src={imageSrc}
              alt={title}
              className="w-1/3 rounded hover:shadow-lg transition"
            />
          </a>
        </div>
      )}

      {type === 'video' && (
        <div className="flex justify-center">
          <video controls className="w-2/3 rounded shadow">
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {type === 'tweet' && (
        <div className="flex justify-center">
          <a href={imageSrc} target="_blank" rel="noopener noreferrer">
            <img
              src={imageSrc}
              alt="Tweet"
              className="w-1/3 rounded border border-blue-300 hover:shadow-lg transition"
            />
          </a>
        </div>
      )}
    </div>
  );
}