import React, { useState } from 'react';

const YouTubeVideos = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'player'

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📺</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Video Suggestions Available</h3>
        <p className="text-gray-500">
          Educational video recommendations will appear here after your document is analyzed.
        </p>
      </div>
    );
  }

  const formatViewCount = (count) => {
    if (!count) return 'N/A views';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  };

  const formatDuration = (publishedAt) => {
    if (!publishedAt) return '';
    const date = new Date(publishedAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) {
      return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    } else if (diffDays > 30) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
    return 'Today';
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setViewMode('player');
  };

  const VideoCard = ({ video, index }) => (
    <div
      key={index}
      className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-pure-black transition-all duration-200 cursor-pointer"
      onClick={() => handleVideoSelect(video)}
    >
      <div className="relative aspect-video bg-gray-100">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-4xl text-gray-400">📺</div>
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white bg-opacity-90 rounded-full p-3">
            <div className="w-6 h-6 bg-pure-black rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-0.5"></div>
            </div>
          </div>
        </div>

        {/* View Count Badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {formatViewCount(video.viewCount)}
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-pure-black text-sm leading-tight mb-2 line-clamp-2">
          {video.title}
        </h4>

        <p className="text-gray-600 text-xs mb-2">{video.channelTitle}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDuration(video.publishedAt)}</span>
          <span className="bg-gray-100 px-2 py-1 rounded">Educational</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-pure-black">📺 Educational Videos</h3>
          <p className="text-gray-medium mt-1">
            {videos.length} video suggestion{videos.length !== 1 ? 's' : ''} related to your content
          </p>
        </div>

        {selectedVideo && viewMode === 'player' && (
          <button
            onClick={() => {
              setViewMode('grid');
              setSelectedVideo(null);
            }}
            className="btn-secondary"
          >
            Back to Grid
          </button>
        )}
      </div>

      {viewMode === 'player' && selectedVideo ? (
        /* Video Player View */
        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?rel=0&modestbranding=1`}
                title={selectedVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            <div className="p-6">
              <h4 className="text-xl font-semibold text-pure-black mb-3">
                {selectedVideo.title}
              </h4>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span className="font-medium">{selectedVideo.channelTitle}</span>
                <div className="flex gap-4">
                  <span>{formatViewCount(selectedVideo.viewCount)}</span>
                  <span>{formatDuration(selectedVideo.publishedAt)}</span>
                </div>
              </div>

              {selectedVideo.description && (
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Description:</h5>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {selectedVideo.description}
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <a
                  href={selectedVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-block"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Other Videos */}
          <div>
            <h4 className="text-lg font-semibold text-pure-black mb-4">More Videos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.filter(v => v.videoId !== selectedVideo.videoId).slice(0, 6).map((video, index) => (
                <VideoCard key={video.videoId} video={video} index={index} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div>
          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {videos.map((video, index) => (
              <VideoCard key={video.videoId || index} video={video} index={index} />
            ))}
          </div>

          {/* Sorting Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-pure-black mb-2">About these suggestions</h4>
                <p className="text-sm text-gray-600">
                  Videos are sorted by relevance and view count to show you the most popular
                  educational content related to your study material.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-pure-black">{videos.length}</div>
                <div className="text-xs text-gray-500">Total Videos</div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
            <h5 className="font-semibold text-blue-800 mb-2">💡 Study Tips</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Watch videos at 1.25x or 1.5x speed for efficient learning</li>
              <li>• Take notes while watching and pause frequently</li>
              <li>• Look for videos from educational channels and universities</li>
              <li>• Use subtitles to better understand complex topics</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeVideos;