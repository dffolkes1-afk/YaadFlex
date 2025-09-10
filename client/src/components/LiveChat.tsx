import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, PhoneCall, MessageCircle, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  type: 'text' | 'voice' | 'system';
}

interface LiveChatProps {
  rideId?: string;
  otherUser?: {
    id: string;
    name: string;
    role: 'driver' | 'passenger';
    phone?: string;
  };
}

export function LiveChat({ rideId, otherUser }: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  // Sample messages for demonstration
  const sampleMessages: Message[] = [
    {
      id: '1',
      userId: 'driver1',
      username: 'Marcus (Driver)',
      message: 'On my way to pick you up! ETA 5 minutes',
      timestamp: '2 mins ago',
      type: 'text'
    },
    {
      id: '2',
      userId: 'passenger1', 
      username: 'Sarah (Passenger)',
      message: 'Perfect! I\'m wearing a blue jacket by the main entrance',
      timestamp: '1 min ago',
      type: 'text'
    },
    {
      id: '3',
      userId: 'system',
      username: 'YaadFlex',
      message: 'Driver has arrived at pickup location',
      timestamp: 'just now',
      type: 'system'
    }
  ];

  useEffect(() => {
    setMessages(sampleMessages);
    
    // Initialize WebSocket connection for real-time chat
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        setIsConnected(true);
        console.log('Chat WebSocket connected');
      };
      
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat_message') {
          setMessages(prev => [...prev, data.message]);
        }
      };
      
      ws.current.onclose = () => {
        setIsConnected(false);
        console.log('Chat WebSocket disconnected');
      };
    } catch (error) {
      console.log('WebSocket connection failed, using demo mode');
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: 'current_user',
      username: 'You',
      message: newMessage,
      timestamp: 'now',
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Send via WebSocket if connected
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'chat_message',
        rideId,
        message
      }));
    }
  };

  const startVoiceCall = () => {
    setCallStatus('calling');
    setIsCalling(true);
    
    // Simulate call connection
    setTimeout(() => {
      setCallStatus('connected');
      const systemMessage: Message = {
        id: Date.now().toString(),
        userId: 'system',
        username: 'YaadFlex',
        message: `Voice call connected with ${otherUser?.name || 'other user'}`,
        timestamp: 'now',
        type: 'system'
      };
      setMessages(prev => [...prev, systemMessage]);
    }, 2000);
  };

  const endCall = () => {
    setCallStatus('ended');
    setIsCalling(false);
    
    const systemMessage: Message = {
      id: Date.now().toString(),
      userId: 'system',
      username: 'YaadFlex',
      message: 'Voice call ended',
      timestamp: 'now',
      type: 'system'
    };
    setMessages(prev => [...prev, systemMessage]);
    
    setTimeout(() => setCallStatus('idle'), 2000);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.start();
      setIsVoiceRecording(true);
      
      mediaRecorder.current.onstop = () => {
        setIsVoiceRecording(false);
        stream.getTracks().forEach(track => track.stop());
        
        // Add voice message to chat
        const voiceMessage: Message = {
          id: Date.now().toString(),
          userId: 'current_user',
          username: 'You',
          message: '🎤 Voice message sent',
          timestamp: 'now',
          type: 'voice'
        };
        setMessages(prev => [...prev, voiceMessage]);
      };
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
          mediaRecorder.current.stop();
        }
      }, 10000);
      
    } catch (error) {
      console.error('Failed to access microphone:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span>Live Chat</span>
            {isConnected && <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>}
          </div>
          
          <div className="flex gap-2">
            {/* Voice Call Button */}
            <Button
              size="sm"
              variant={callStatus === 'connected' ? 'destructive' : 'secondary'}
              onClick={callStatus === 'connected' ? endCall : startVoiceCall}
              disabled={callStatus === 'calling'}
              className="bg-white/20 hover:bg-white/30"
              data-testid="button-voice-call"
            >
              {callStatus === 'calling' ? (
                <div className="flex items-center gap-1">
                  <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                  <span className="text-xs">Calling...</span>
                </div>
              ) : callStatus === 'connected' ? (
                <PhoneCall className="h-4 w-4" />
              ) : (
                <Phone className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardTitle>
        
        {otherUser && (
          <div className="text-sm opacity-90">
            Chatting with {otherUser.name} ({otherUser.role})
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4">
        {/* Messages */}
        <div className="h-64 overflow-y-auto mb-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.userId === 'current_user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-3 py-2 rounded-lg ${
                msg.type === 'system' 
                  ? 'bg-gray-100 text-gray-600 text-center text-sm w-full'
                  : msg.userId === 'current_user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}>
                {msg.type !== 'system' && (
                  <div className="text-xs opacity-75 mb-1">{msg.username}</div>
                )}
                <div className={msg.type === 'voice' ? 'flex items-center gap-1' : ''}>
                  {msg.type === 'voice' && <Volume2 className="h-3 w-3" />}
                  {msg.message}
                </div>
                <div className="text-xs opacity-75 mt-1">{msg.timestamp}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Call Status */}
        {callStatus === 'connected' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700">
                <PhoneCall className="h-4 w-4" />
                <span className="text-sm font-medium">Voice call active</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                  <Mic className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                  <Volume2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="flex gap-2">
          <div className="flex-1 flex gap-1">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
              data-testid="input-message"
            />
            
            {/* Voice Recording Button */}
            <Button
              size="sm"
              variant={isVoiceRecording ? 'destructive' : 'outline'}
              onClick={isVoiceRecording ? stopVoiceRecording : startVoiceRecording}
              className="px-2"
              data-testid="button-voice-record"
            >
              {isVoiceRecording ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <MicOff className="h-3 w-3" />
                </div>
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <Button 
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="bg-green-500 hover:bg-green-600"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Connection Status */}
        <div className="text-xs text-gray-500 mt-2 text-center">
          {isConnected ? (
            <span className="text-green-600">🟢 Real-time chat active</span>
          ) : (
            <span className="text-orange-600">🟡 Demo mode - Real-time coming soon</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}