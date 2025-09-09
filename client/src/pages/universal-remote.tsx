import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plane, 
  Bot, 
  Car, 
  Shield, 
  Lightbulb, 
  Camera, 
  Power, 
  StopCircle, 
  Play, 
  Pause, 
  Settings, 
  Battery, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  Zap,
  Monitor,
  Wifi,
  WifiOff,
  RotateCcw,
  Navigation,
  Home,
  Lock,
  Unlock,
  Bell,
  BellOff
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'drone' | 'robot' | 'vehicle' | 'security' | 'lighting' | 'camera';
  status: 'active' | 'idle' | 'charging' | 'error' | 'offline';
  battery: number;
  location: string;
  lastSeen: string;
  connected: boolean;
}

export default function UniversalRemote() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'drone_001',
      name: 'Security Patrol Drone',
      type: 'drone',
      status: 'active',
      battery: 85,
      location: 'Car Lot - North Section',
      lastSeen: '2 mins ago',
      connected: true
    },
    {
      id: 'robot_001', 
      name: 'Warehouse Bot Alpha',
      type: 'robot',
      status: 'idle',
      battery: 92,
      location: 'Warehouse - Bay 3',
      lastSeen: '1 min ago',
      connected: true
    },
    {
      id: 'vehicle_001',
      name: 'Fleet Vehicle 01',
      type: 'vehicle', 
      status: 'idle',
      battery: 100,
      location: 'Downtown Kingston',
      lastSeen: '5 mins ago',
      connected: true
    },
    {
      id: 'security_001',
      name: 'Main Gate Camera',
      type: 'security',
      status: 'active',
      battery: 100,
      location: 'Main Entrance',
      lastSeen: 'Live',
      connected: true
    },
    {
      id: 'lighting_001',
      name: 'Lot Lighting System',
      type: 'lighting',
      status: 'idle',
      battery: 100,
      location: 'Car Lot - All Zones',
      lastSeen: 'Live',
      connected: true
    },
    {
      id: 'camera_001',
      name: 'Inventory Cam 01',
      type: 'camera',
      status: 'active',
      battery: 78,
      location: 'Showroom Floor',
      lastSeen: 'Live',
      connected: false
    }
  ]);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [automationEnabled, setAutomationEnabled] = useState(true);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'drone': return Plane;
      case 'robot': return Bot;
      case 'vehicle': return Car;
      case 'security': return Shield;
      case 'lighting': return Lightbulb;
      case 'camera': return Camera;
      default: return Monitor;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'charging': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-500';
    if (battery > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const emergencyStop = () => {
    setEmergencyMode(true);
    setDevices(prev => prev.map(device => ({
      ...device,
      status: 'idle' as const
    })));
    setTimeout(() => setEmergencyMode(false), 3000);
  };

  const controlDevice = (deviceId: string, action: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        let newStatus = device.status;
        switch (action) {
          case 'start':
            newStatus = 'active';
            break;
          case 'stop':
            newStatus = 'idle';
            break;
          case 'charge':
            newStatus = 'charging';
            break;
          case 'home':
            newStatus = 'idle';
            break;
        }
        return { ...device, status: newStatus, lastSeen: 'Now' };
      }
      return device;
    }));
  };

  const connectedDevices = devices.filter(d => d.connected).length;
  const activeDevices = devices.filter(d => d.status === 'active').length;
  const lowBatteryDevices = devices.filter(d => d.battery < 30).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Universal Remote Control
            </h1>
            <p className="text-gray-300 mt-2">Command Center for All Connected Devices</p>
          </div>
          
          {/* Emergency Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="automation">Auto Mode</Label>
              <Switch 
                id="automation" 
                checked={automationEnabled}
                onCheckedChange={setAutomationEnabled}
              />
            </div>
            <Button 
              variant="destructive" 
              size="lg"
              onClick={emergencyStop}
              disabled={emergencyMode}
              className="bg-red-600 hover:bg-red-700"
              data-testid="emergency-stop"
            >
              <StopCircle className="h-5 w-5 mr-2" />
              {emergencyMode ? 'STOPPING ALL...' : 'EMERGENCY STOP'}
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Connected Devices</p>
                  <p className="text-2xl font-bold text-green-400">{connectedDevices}/{devices.length}</p>
                </div>
                <Wifi className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Devices</p>
                  <p className="text-2xl font-bold text-blue-400">{activeDevices}</p>
                </div>
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Low Battery</p>
                  <p className="text-2xl font-bold text-red-400">{lowBatteryDevices}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Automation</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {automationEnabled ? 'ON' : 'OFF'}
                  </p>
                </div>
                <Settings className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Control Interface */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Device List */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <Monitor className="h-5 w-5" />
                  Device Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {devices.map((device) => {
                  const IconComponent = getDeviceIcon(device.type);
                  return (
                    <div
                      key={device.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-yellow-500/50 ${
                        selectedDevice?.id === device.id 
                          ? 'border-yellow-500 bg-yellow-500/10' 
                          : 'border-gray-600 bg-gray-800/30'
                      }`}
                      onClick={() => setSelectedDevice(device)}
                      data-testid={`device-${device.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <IconComponent className="h-6 w-6 text-blue-400" />
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(device.status)}`}></div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{device.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {device.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {device.lastSeen}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Battery className={`h-4 w-4 ${getBatteryColor(device.battery)}`} />
                              <span className={`text-sm font-medium ${getBatteryColor(device.battery)}`}>
                                {device.battery}%
                              </span>
                            </div>
                            <Badge 
                              variant={device.connected ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {device.connected ? 'Connected' : 'Offline'}
                            </Badge>
                          </div>
                          
                          {device.connected && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  controlDevice(device.id, device.status === 'active' ? 'stop' : 'start');
                                }}
                                data-testid={`control-${device.id}`}
                              >
                                {device.status === 'active' ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  controlDevice(device.id, 'home');
                                }}
                                data-testid={`home-${device.id}`}
                              >
                                <Home className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {selectedDevice ? (
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-yellow-400">
                    Control: {selectedDevice.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="manual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="manual">Manual</TabsTrigger>
                      <TabsTrigger value="auto">Automation</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="manual" className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => controlDevice(selectedDevice.id, 'start')}
                          data-testid="manual-start"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => controlDevice(selectedDevice.id, 'stop')}
                          data-testid="manual-stop"
                        >
                          <StopCircle className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => controlDevice(selectedDevice.id, 'home')}
                          data-testid="manual-home"
                        >
                          <Home className="h-4 w-4 mr-2" />
                          Return Home
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => controlDevice(selectedDevice.id, 'charge')}
                          data-testid="manual-charge"
                        >
                          <Battery className="h-4 w-4 mr-2" />
                          Charge
                        </Button>
                      </div>
                      
                      {selectedDevice.type === 'drone' && (
                        <div className="space-y-2">
                          <Label>Flight Commands</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm">
                              <Navigation className="h-4 w-4 mr-1" />
                              Patrol
                            </Button>
                            <Button variant="outline" size="sm">
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Orbit
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="auto" className="space-y-4">
                      <div className="space-y-2">
                        <Label>Schedule Task</Label>
                        <Input placeholder="e.g., Patrol lot every hour" />
                      </div>
                      <div className="space-y-2">
                        <Label>Repeat</Label>
                        <Input type="time" />
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule Task
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                <CardContent className="p-8 text-center">
                  <Monitor className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Select a device to control</p>
                </CardContent>
              </Card>
            )}

            {/* Live Monitoring */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <Camera className="h-5 w-5" />
                  Live Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-gray-500">
                    <Camera className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Live feed will appear here</p>
                    <p className="text-xs">Select an active camera device</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Quality: HD</span>
                  <span>Latency: 45ms</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setDevices(prev => prev.map(d => ({ ...d, status: 'idle' as const })))}
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop All Devices
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setDevices(prev => prev.map(d => ({ ...d, status: 'charging' as const })))}
                >
                  <Battery className="h-4 w-4 mr-2" />
                  Charge All
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setDevices(prev => prev.map(d => ({ ...d, status: 'idle' as const })))}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Return All Home
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security Lockdown
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}