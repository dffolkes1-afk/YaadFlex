// components/LiveWindow.tsx - Smart Live Stream Component
import React, { useEffect, useRef, useState } from "react";
import { Play, ExternalLink, Radio, Eye } from "lucide-react";

type Stream = {
  id: string;
  title: string;
  streamUrl: string;
  posterImage?: string;
  provider: "hls" | "youtube" | "twitch" | "vimeo" | "other";
  isLive: boolean;
};

export default function LiveWindow({ stream }: { stream: Stream }) {
  if (!stream) return null;

  if (stream.provider === "youtube") {
    const videoId = extractYouTubeId(stream.streamUrl);
    const src = `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0`;
    return <IFramePlayer src={src} title={stream.title} isLive={stream.isLive} />;
  }

  if (stream.provider === "twitch") {
    const channel = stream.streamUrl.split("/").pop();
    const src = `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}&muted=false`;
    return <IFramePlayer src={src} title={stream.title} isLive={stream.isLive} />;
  }

  if (stream.provider === "vimeo") {
    const id = stream.streamUrl.split("/").pop();
    const src = `https://player.vimeo.com/video/${id}`;
    return <IFramePlayer src={src} title={stream.title} isLive={stream.isLive} />;
  }

  if (stream.provider === "hls") {
    return <HlsPlayer src={stream.streamUrl} poster={stream.posterImage} title={stream.title} isLive={stream.isLive} />;
  }

  // Internet Archive and other embeds
  if (stream.provider === "other" && stream.streamUrl.includes("archive.org/embed")) {
    return <ArchiveOrgPlayer src={stream.streamUrl} title={stream.title} poster={stream.posterImage} />;
  }

  // fallback: open link
  return (
    <div className="rounded-xl overflow-hidden border border-gray-700 p-6 bg-black/90 text-white">
      <div className="flex items-center gap-3 mb-4">
        <Radio className="h-6 w-6 text-green-500" />
        <h3 className="text-lg font-semibold">{stream.title}</h3>
        {stream.isLive && (
          <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            LIVE
          </span>
        )}
      </div>
      <a 
        className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
        href={stream.streamUrl} 
        target="_blank" 
        rel="noreferrer"
      >
        <ExternalLink className="h-4 w-4" />
        Open stream in new window
      </a>
    </div>
  );
}

function IFramePlayer({ src, title, isLive }: { src: string; title: string; isLive: boolean }) {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-2xl bg-black">
      <div className="flex items-center justify-between p-3 bg-gray-900">
        <div className="flex items-center gap-3">
          <Radio className="h-5 w-5 text-green-500" />
          <span className="font-medium text-white">{title}</span>
        </div>
        {isLive && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 text-sm font-bold">LIVE</span>
          </div>
        )}
      </div>
      <div className="aspect-video w-full">
        <iframe
          src={src}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

function extractYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
    if (u.searchParams.get("v")) return u.searchParams.get("v")!;
  } catch {}
  // fallback - extract ID from end of URL
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : url;
}

function ArchiveOrgPlayer({ src, title, poster }: { src: string; title: string; poster?: string }) {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-2xl bg-black">
      <div className="flex items-center justify-between p-3 bg-gray-900">
        <div className="flex items-center gap-3">
          <Radio className="h-5 w-5 text-green-500" />
          <span className="font-medium text-white">{title}</span>
        </div>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
          Internet Archive
        </span>
      </div>
      <div className="aspect-video w-full">
        <iframe
          src={src}
          title={title}
          allow="fullscreen"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

function HlsPlayer({ src, poster, title, isLive }: { src: string; poster?: string; title: string; isLive: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error("Play failed:", err);
        setError("Failed to start playback");
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-2xl bg-black">
      <div className="flex items-center justify-between p-3 bg-gray-900">
        <div className="flex items-center gap-3">
          <Radio className="h-5 w-5 text-green-500" />
          <span className="font-medium text-white">{title}</span>
        </div>
        {isLive && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 text-sm font-bold">LIVE</span>
          </div>
        )}
      </div>
      
      <div className="aspect-video w-full bg-black relative">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <p className="mb-4">Stream unavailable</p>
              <a 
                href={src} 
                target="_blank" 
                rel="noreferrer"
                className="text-green-400 hover:text-green-300 underline"
              >
                Open in media player
              </a>
            </div>
          </div>
        ) : !isPlaying ? (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/50"
            onClick={handlePlay}
          >
            {poster && (
              <img 
                src={poster} 
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="relative z-10 bg-black/70 rounded-full p-4 hover:bg-black/90 transition-colors">
              <Play className="h-12 w-12 text-white" />
            </div>
          </div>
        ) : null}
        
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          poster={poster}
          onError={() => setError("Stream error")}
        >
          <source src={src} type="application/x-mpegURL" />
          Your browser does not support HLS playback.
        </video>
      </div>
    </div>
  );
}