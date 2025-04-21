import React from "react";

export const MediaViewer = ({ previewMedia, setPreviewMedia }) => {
  return (
    <div>
      {previewMedia && (
        <div
          className="fixed inset-0 z-50 backdrop-blur-lg bg-gray-800 bg-opacity-70 flex items-center justify-center"
          onClick={() => setPreviewMedia(null)} // close on outside click
        >
          <div className="relative">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-1"
            >
              ❌
            </button>

            {previewMedia.includes(".mp4") ? (
              <video
                src={previewMedia}
                controls
                autoPlay
                className="max-w-[90vw] max-h-[90vh] rounded-lg"
              />
            ) : (
              <img
                src={previewMedia}
                alt="Preview"
                className="max-w-[90vw] max-h-[90vh] rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const AllMedia = ({ allMedia, setAllMedia, setPreviewMedia }) => {
  return (
    <div>
      {allMedia && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-lg bg-gray-800 bg-opacity-80 flex flex-col p-4 overflow-y-auto"
          onClick={() => setAllMedia(null)} // Close on background click
        >
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {allMedia.map((media, idx) => (
              <div
                key={idx}
                className="cursor-pointer"
                onClick={() => setPreviewMedia(media)}
              >
                {media.endsWith(".mp4") ? (
                  <video
                    src={media}
                    className="w-40 h-40 rounded object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={media}
                    alt="Media"
                    className="w-40 h-40 rounded object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            className="text-white absolute top-4 right-4 bg-gray-800 px-3 py-1 rounded"
            onClick={() => setAllMedia(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
