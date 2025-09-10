// pages/MediaHub.tsx - Media Hub with Live Windows
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Radio, Verified, Users, Eye, ExternalLink } from "lucide-react";
import LiveWindow from "@/components/LiveWindow";

interface MediaChannel {
  id: string;
  handle: string;
  displayName: string;
  about: string;
  verified: boolean;
  avatarUrl: string;
  createdAt: string;
}

interface MediaStream {
  id: string;
  channelId: string;
  title: string;
  streamUrl: string;
  provider: "hls" | "youtube" | "twitch" | "vimeo" | "other";
  posterImage?: string;
  isLive: boolean;
  createdAt: string;
}

export default function MediaHub() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  // Fetch media channels
  const { data: channels = [], isLoading: channelsLoading } = useQuery<MediaChannel[]>({
    queryKey: ['/api/media/channels'],
  });

  // Fetch streams for selected channel
  const { data: streams = [] } = useQuery<MediaStream[]>({
    queryKey: ['/api/media/channels', selectedChannel, 'streams'],
    enabled: !!selectedChannel,
  });

  // Fetch live streams for homepage
  const { data: liveStreams = [] } = useQuery<MediaStream[]>({
    queryKey: ['/api/media/streams/live'],
  });

  if (channelsLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Radio className="h-12 w-12 text-green-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading Media Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-500 mb-4 flex items-center justify-center gap-3">
              <Radio className="h-10 w-10" />
              YaadFlex Media Hub
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Live streaming from Jamaica's top media houses - TVJ, CVM TV, The Gleaner and more. 
              Watch live news, entertainment, and events all in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Live Streams Section */}
        {liveStreams.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-green-500 mb-6 flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              Live Now
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {liveStreams.map((stream: MediaStream) => {
                const channel = channels.find((c: MediaChannel) => c.id === stream.channelId);
                return (
                  <div key={stream.id} className="space-y-4">
                    {channel && (
                      <div className="flex items-center gap-3">
                        <img 
                          src={channel.avatarUrl} 
                          alt={channel.displayName}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-medium">{channel.displayName}</span>
                        {channel.verified && <Verified className="h-4 w-4 text-blue-500" />}
                      </div>
                    )}
                    <LiveWindow stream={stream} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Channels Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Media Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel: MediaChannel) => (
              <div 
                key={channel.id}
                className={`bg-gray-900 rounded-lg p-6 cursor-pointer transition-colors hover:bg-gray-800 ${
                  selectedChannel === channel.id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setSelectedChannel(channel.id)}
                data-testid={`channel-card-${channel.handle}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={channel.avatarUrl} 
                    alt={channel.displayName}
                    className="w-16 h-16 rounded-full border-2 border-gray-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{channel.displayName}</h3>
                      {channel.verified && <Verified className="h-5 w-5 text-blue-500" />}
                    </div>
                    <p className="text-gray-400 text-sm">@{channel.handle}</p>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">{channel.about}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Joined {new Date(channel.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    className="text-green-500 hover:text-green-400 transition-colors text-sm font-medium"
                    data-testid={`button-view-${channel.handle}`}
                  >
                    View Channel →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Streams */}
        {selectedChannel && streams.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {channels.find((c: MediaChannel) => c.id === selectedChannel)?.displayName} Streams
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {streams.map((stream: MediaStream) => (
                <div key={stream.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{stream.title}</h3>
                    {stream.isLive && (
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        LIVE
                      </span>
                    )}
                  </div>
                  <LiveWindow stream={stream} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedChannel && streams.length === 0 && (
          <div className="text-center py-12">
            <Radio className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No streams available for this channel yet.</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 p-8 bg-gray-900 rounded-lg">
          <h3 className="text-xl font-bold text-green-500 mb-4">Media Partners Welcome</h3>
          <p className="text-gray-400 mb-4">
            Are you a media house in Jamaica or the Caribbean? Join YaadFlex Media Hub to reach more viewers 
            and connect with our community. We provide verified profiles and professional streaming tools.
          </p>
          <p className="text-sm text-gray-500">
            Contact us to get your media house verified and start streaming on YaadFlex.
          </p>
        </div>
      </div>
    </div>
  );
}