import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Music, Heart, Share, Download, Repeat, Shuffle
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  genre?: string;
}

interface MusicPlayerProps {
  track?: Track;
  playlist?: Track[];
  autoPlay?: boolean;
  showFullPlayer?: boolean;
}

export function MusicPlayer({ track, playlist = [], autoPlay = false, showFullPlayer = true }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(track);
  const [isLiked, setIsLiked] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sample tracks for demo
  const sampleTracks: Track[] = [
    {
      id: '1',
      title: 'Jamaica Vibes',
      artist: 'YaadFlex Artist',
      duration: 180,
      url: 'https://example.com/track1.mp3',
      genre: 'Reggae'
    },
    {
      id: '2', 
      title: 'Caribbean Dreams',
      artist: 'Island Creator',
      duration: 210,
      url: 'https://example.com/track2.mp3',
      genre: 'Dancehall'
    },
    {
      id: '3',
      title: 'Global Rhythm',
      artist: 'YaadFlex Global',
      duration: 195,
      url: 'https://example.com/track3.mp3',
      genre: 'Afrobeats'
    }
  ];

  const tracks = playlist.length > 0 ? playlist : sampleTracks;
  const displayTrack = currentTrack || tracks[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackEnd = () => {
    if (isLooping) {
      audioRef.current?.play();
    } else {
      nextTrack();
    }
  };

  const nextTrack = () => {
    const currentIndex = tracks.findIndex(t => t.id === displayTrack.id);
    const nextIndex = isShuffled 
      ? Math.floor(Math.random() * tracks.length)
      : (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setCurrentTime(0);
  };

  const previousTrack = () => {
    const currentIndex = tracks.findIndex(t => t.id === displayTrack.id);
    const prevIndex = isShuffled
      ? Math.floor(Math.random() * tracks.length)
      : currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    setCurrentTrack(tracks[prevIndex]);
    setCurrentTime(0);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showFullPlayer) {
    // Mini player for posts
    return (
      <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg">
        <Button
          size="sm"
          variant="ghost"
          onClick={togglePlay}
          className="text-white hover:bg-white/20 h-8 w-8 p-0"
          data-testid="mini-play-button"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate">{displayTrack.title}</div>
          <div className="text-xs opacity-75 truncate">{displayTrack.artist}</div>
        </div>
        <Music className="h-4 w-4" />
        <audio ref={audioRef} src={displayTrack.url} />
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white border-none">
      <CardContent className="p-6">
        {/* Track Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Music className="h-8 w-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate">{displayTrack.title}</h3>
            <p className="text-purple-200 truncate">{displayTrack.artist}</p>
            {displayTrack.genre && (
              <p className="text-xs text-purple-300">{displayTrack.genre}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsLiked(!isLiked)}
              className={`text-white hover:bg-white/20 ${isLiked ? 'text-red-400' : ''}`}
              data-testid="like-button"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              data-testid="share-button"
            >
              <Share className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              data-testid="download-button"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-purple-200">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsShuffled(!isShuffled)}
            className={`text-white hover:bg-white/20 ${isShuffled ? 'text-green-400' : ''}`}
            data-testid="shuffle-button"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={previousTrack}
            className="text-white hover:bg-white/20"
            data-testid="previous-button"
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            onClick={togglePlay}
            className="text-white hover:bg-white/20 h-12 w-12 p-0 bg-white/20"
            data-testid="play-pause-button"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={nextTrack}
            className="text-white hover:bg-white/20"
            data-testid="next-button"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsLooping(!isLooping)}
            className={`text-white hover:bg-white/20 ${isLooping ? 'text-green-400' : ''}`}
            data-testid="loop-button"
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleMute}
            className="text-white hover:bg-white/20"
            data-testid="mute-button"
          >
            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0] / 100)}
            className="flex-1"
          />
        </div>

        {/* Audio Element */}
        <audio 
          ref={audioRef} 
          src={displayTrack.url}
          loop={isLooping}
          autoPlay={autoPlay}
        />
      </CardContent>
    </Card>
  );
}