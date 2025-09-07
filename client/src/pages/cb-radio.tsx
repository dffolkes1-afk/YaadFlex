import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Radio, 
  Users, 
  MapPin, 
  AlertTriangle, 
  Send,
  Phone,
  TruckIcon,
  Zap,
  Shield,
  Signal
} from 'lucide-react';

interface CbRadioChannel {
  id: string;
  channelNumber: number;
  name: string;
  description: string;
  isEmergency: boolean;
  maxUsers: number;
  currentUsers: number;
}

interface CbRadioMessage {
  id: string;
  channelId: string;
  senderCallSign: string;
  message: string;
  messageType: string;
  priority: string;
  latitude?: string;
  longitude?: string;
  createdAt: string;
}

interface DriverCbProfile {
  id: string;
  driverId: string;
  callSign: string;
  preferredChannels: string[];
  isOnline: boolean;
  totalMessages: number;
  reputation: number;
}

export default function CBRadioPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState<'chat' | 'alert' | 'emergency'>('chat');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch CB Radio channels
  const { data: channels = [], isLoading: channelsLoading } = useQuery<CbRadioChannel[]>({
    queryKey: ['/api/cb-radio/channels'],
    retry: false,
  });

  // Fetch driver CB profile
  const { data: profile, isLoading: profileLoading } = useQuery<DriverCbProfile>({
    queryKey: ['/api/cb-radio/profile'],
    retry: false,
  });

  // Fetch messages for selected channel
  const { data: messages = [], refetch: refetchMessages } = useQuery<CbRadioMessage[]>({
    queryKey: ['/api/cb-radio/channels', selectedChannel, 'messages'],
    enabled: !!selectedChannel,
    retry: false,
  });

  // Fetch online drivers in channel
  const { data: onlineDrivers = [] } = useQuery<DriverCbProfile[]>({
    queryKey: ['/api/cb-radio/channels', selectedChannel, 'drivers'],
    enabled: !!selectedChannel,
    retry: false,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      if (ws && isConnected) {
        ws.send(JSON.stringify({
          type: 'send_message',
          ...messageData
        }));
      }
    },
    onSuccess: () => {
      setMessageText('');
    },
    onError: (error) => {
      toast({
        title: "Failed to Send Message",
        description: "Could not send your message. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Connect to WebSocket when channel is selected
  useEffect(() => {
    if (!selectedChannel || !profile) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/cb-radio`;
    
    const websocket = new WebSocket(wsUrl);
    
    websocket.onopen = () => {
      console.log('📻 Connected to CB Radio');
      setIsConnected(true);
      
      // Join channel
      websocket.send(JSON.stringify({
        type: 'join_channel',
        channelId: selectedChannel,
        driverId: (user as any)?.id,
        callSign: profile.callSign
      }));
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'message_received') {
        // Refetch messages to update UI
        refetchMessages();
        
        // Show notification for emergency messages
        if (data.messageType === 'emergency') {
          toast({
            title: `🚨 EMERGENCY - ${data.senderCallSign}`,
            description: data.message,
            variant: "destructive"
          });
        }
      } else if (data.type === 'driver_joined' || data.type === 'driver_left') {
        // Update online drivers list
        queryClient.invalidateQueries({ queryKey: ['/api/cb-radio/channels', selectedChannel, 'drivers'] });
      }
    };

    websocket.onerror = (error) => {
      console.error('CB Radio WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Lost connection to CB Radio. Reconnecting...",
        variant: "destructive"
      });
    };

    websocket.onclose = () => {
      console.log('📻 Disconnected from CB Radio');
      setIsConnected(false);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [selectedChannel, profile, user]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChannel || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({
      message: messageText.trim(),
      messageType,
      priority: messageType === 'emergency' ? 'high' : 'normal',
      location: null // TODO: Add location sharing
    });
  };

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    setMessageText('');
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'alert': return <Zap className="h-4 w-4 text-amber-500" />;
      default: return <Radio className="h-4 w-4 text-blue-400" />;
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-900/20 border-red-500/50';
      case 'alert': return 'bg-amber-900/20 border-amber-500/50';
      default: return 'bg-slate-900/40 border-slate-700/50';
    }
  };

  if (profileLoading || channelsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <Radio className="h-12 w-12 text-blue-400 animate-pulse" />
            <p className="text-slate-300">Initializing CB Radio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6" data-testid="page-cb-radio">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                <Radio className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  YardFlex CB Radio
                </h1>
                <p className="text-slate-400 mt-1">Professional Driver Communication Network</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-slate-800/50 border-slate-700/50">
                <Phone className="h-4 w-4 mr-1" />
                {profile?.callSign || 'Loading...'}
              </Badge>
              <Badge variant={isConnected ? 'default' : 'destructive'} 
                     className={isConnected ? 'bg-green-500/20 border-green-500/50 text-green-400' : ''}>
                <Signal className="h-4 w-4 mr-1" />
                {isConnected ? 'ONLINE' : 'OFFLINE'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Channels Sidebar */}
          <div className="col-span-3">
            <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-blue-400 flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2" />
                  Channels
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {channels.map((channel: CbRadioChannel) => (
                      <Button
                        key={channel.id}
                        variant={selectedChannel === channel.id ? "default" : "ghost"}
                        className={`w-full justify-start text-left h-auto p-3 ${
                          selectedChannel === channel.id
                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                            : 'hover:bg-slate-800/50'
                        }`}
                        onClick={() => handleChannelSelect(channel.id)}
                        data-testid={`button-channel-${channel.channelNumber}`}
                      >
                        <div className="flex flex-col items-start w-full">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-semibold">CH {channel.channelNumber}</span>
                            {channel.isEmergency && (
                              <Shield className="h-4 w-4 text-red-400" />
                            )}
                          </div>
                          <span className="text-xs text-slate-400 mt-1">{channel.name}</span>
                          <div className="flex items-center justify-between w-full mt-1">
                            <span className="text-xs text-slate-500">{channel.currentUsers} users</span>
                            <Badge variant="secondary" className="text-xs bg-slate-800/50 border-slate-700/50">
                              <Users className="h-3 w-3 mr-1" />
                              {channel.currentUsers}
                            </Badge>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="col-span-6">
            <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-700/50 shadow-xl h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-400 flex items-center">
                  <Radio className="h-5 w-5 mr-2" />
                  {selectedChannel 
                    ? `Channel ${channels.find((c: CbRadioChannel) => c.id === selectedChannel)?.channelNumber || ''} Chat`
                    : 'Select a Channel'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-3">
                {selectedChannel ? (
                  <>
                    {/* Messages */}
                    <ScrollArea className="flex-1 mb-4" data-testid="messages-area">
                      <div className="space-y-3">
                        {messages.length === 0 ? (
                          <div className="text-center text-slate-500 py-8">
                            <Radio className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No messages yet. Break the ice!</p>
                          </div>
                        ) : (
                          messages.map((msg: CbRadioMessage) => (
                            <div
                              key={msg.id}
                              className={`p-3 rounded-lg border ${getMessageTypeColor(msg.messageType)}`}
                              data-testid={`message-${msg.id}`}
                            >
                              <div className="flex items-start justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  {getMessageTypeIcon(msg.messageType)}
                                  <span className="font-semibold text-blue-400">{msg.senderCallSign}</span>
                                </div>
                                <span className="text-xs text-slate-500">
                                  {new Date(msg.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-slate-200 ml-6">{msg.message}</p>
                              {msg.latitude && msg.longitude && (
                                <div className="flex items-center space-x-1 mt-2 ml-6">
                                  <MapPin className="h-3 w-3 text-blue-400" />
                                  <span className="text-xs text-blue-400">Location shared</span>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Select value={messageType} onValueChange={(value: 'chat' | 'alert' | 'emergency') => setMessageType(value)}>
                          <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700/50" data-testid="select-message-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chat">
                              <div className="flex items-center">
                                <Radio className="h-4 w-4 mr-2 text-blue-400" />
                                Chat
                              </div>
                            </SelectItem>
                            <SelectItem value="alert">
                              <div className="flex items-center">
                                <Zap className="h-4 w-4 mr-2 text-amber-500" />
                                Alert
                              </div>
                            </SelectItem>
                            <SelectItem value="emergency">
                              <div className="flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                Emergency
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex-1 flex space-x-2">
                          <Input
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type your message... (10-4)"
                            className="bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder-slate-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={!isConnected}
                            data-testid="input-message"
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!messageText.trim() || !isConnected || sendMessageMutation.isPending}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            data-testid="button-send"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {!isConnected && (
                        <p className="text-sm text-amber-400 text-center">
                          Connecting to channel... Please wait.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <Radio className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Welcome to CB Radio</h3>
                      <p>Select a channel from the sidebar to start communicating with other drivers.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Online Drivers Sidebar */}
          <div className="col-span-3">
            <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-green-400 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Online Drivers ({onlineDrivers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <ScrollArea className="h-96">
                  {selectedChannel ? (
                    <div className="space-y-2">
                      {onlineDrivers.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-4">No drivers online in this channel</p>
                      ) : (
                        onlineDrivers.map((driver: DriverCbProfile) => (
                          <div
                            key={driver.id}
                            className="p-2 rounded border border-slate-700/50 bg-slate-800/30"
                            data-testid={`driver-${driver.callSign}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-blue-400">{driver.callSign}</span>
                              <Badge variant="secondary" className="bg-green-500/20 border-green-500/50 text-green-400 text-xs">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                                Online
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                              <span>{driver.totalMessages} msgs</span>
                              <span>⭐ {driver.reputation.toFixed(1)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 py-8">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">Select a channel to see online drivers</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}