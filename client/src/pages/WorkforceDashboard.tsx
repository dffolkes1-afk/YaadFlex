import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Briefcase, 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock,
  UserCheck,
  UserX,
  Wrench,
  Building2,
  Car,
  Mail,
  Search,
  Plus,
  Settings,
  TrendingUp
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  industry: string;
  activeJobs: number;
  totalJobs: number;
  rating: number;
}

interface Job {
  id: string;
  title: string;
  description: string;
  jobType: string;
  city: string;
  payRate: number;
  payType: string;
  workersNeeded: number;
  hiredWorkers: number;
  status: string;
  totalApplicants: number;
  isUrgent: boolean;
  createdAt: string;
}

interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  experienceLevel: string;
  rating: number;
  totalJobsCompleted: number;
  isAvailable: boolean;
  skills: string[];
}

interface Equipment {
  id: string;
  name: string;
  category: string;
  condition: string;
  isAvailable: boolean;
  dailyRate: number;
}

interface VehicleListing {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  condition: string;
  city: string;
}

export default function WorkforceDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user's companies
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
    enabled: !!user
  });

  // Fetch jobs
  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
    queryFn: () => apiRequest('/api/jobs?limit=100')
  });

  // Fetch workers
  const { data: workers = [] } = useQuery<Worker[]>({
    queryKey: ['/api/workers'],
    queryFn: () => apiRequest('/api/workers')
  });

  // Fetch equipment
  const { data: equipment = [] } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
    queryFn: () => apiRequest('/api/equipment')
  });

  // Fetch vehicle listings
  const { data: vehicles = [] } = useQuery<VehicleListing[]>({
    queryKey: ['/api/vehicle-listings'],
    queryFn: () => apiRequest('/api/vehicle-listings?limit=50')
  });

  // Create company mutation
  const createCompanyMutation = useMutation({
    mutationFn: (companyData: any) => apiRequest('/api/companies', 'POST', companyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      toast({ title: 'Success', description: 'Company created successfully!' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create company', variant: 'destructive' });
    }
  });

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: (jobData: any) => apiRequest('/api/jobs', 'POST', jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({ title: 'Success', description: 'Job posted successfully!' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create job', variant: 'destructive' });
    }
  });

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'open').length,
    totalWorkers: workers.length,
    availableWorkers: workers.filter(w => w.isAvailable).length,
    totalEquipment: equipment.length,
    availableEquipment: equipment.filter(e => e.isAvailable).length,
    totalVehicles: vehicles.length,
    companies: companies.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                💼 YaadFlex Workforce Command Center
              </h1>
              <p className="text-gray-300">
                The Ultimate Caribbean Job Creation & Worker Management Platform
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Welcome back,</p>
              <p className="text-xl font-semibold text-white">{user?.firstName || 'Boss'}</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card data-testid="stat-jobs" className="bg-blue-500/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.activeJobs}</p>
                  <p className="text-sm text-gray-300">Active Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-workers" className="bg-green-500/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.availableWorkers}</p>
                  <p className="text-sm text-gray-300">Available Workers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-equipment" className="bg-orange-500/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Wrench className="h-8 w-8 text-orange-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.availableEquipment}</p>
                  <p className="text-sm text-gray-300">Equipment Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-vehicles" className="bg-purple-500/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Car className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalVehicles}</p>
                  <p className="text-sm text-gray-300">Vehicles Listed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 bg-white/10 backdrop-blur-md">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs" data-testid="tab-jobs">Jobs</TabsTrigger>
            <TabsTrigger value="workers" data-testid="tab-workers">Workers</TabsTrigger>
            <TabsTrigger value="equipment" data-testid="tab-equipment">Equipment</TabsTrigger>
            <TabsTrigger value="vehicles" data-testid="tab-vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="companies" data-testid="tab-companies">Companies</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Recent Jobs */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Recent Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {jobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium text-sm">{job.title}</p>
                          <p className="text-gray-300 text-xs">{job.city}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={job.isUrgent ? 'destructive' : 'secondary'} className="text-xs">
                              {job.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-green-400 font-medium text-sm">
                          ${job.payRate}/{job.payType === 'hourly' ? 'hr' : 'day'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Workers */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Top Workers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workers
                      .sort((a, b) => b.rating - a.rating)
                      .slice(0, 5)
                      .map((worker) => (
                        <div key={worker.id} className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium text-sm">
                              {worker.firstName} {worker.lastName}
                            </p>
                            <p className="text-gray-300 text-xs">{worker.city}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-yellow-400 text-sm">★ {worker.rating}</p>
                            <p className="text-gray-300 text-xs">{worker.totalJobsCompleted} jobs</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      data-testid="button-post-job"
                      onClick={() => setActiveTab('jobs')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Post New Job
                    </Button>
                    <Button 
                      data-testid="button-find-workers"
                      onClick={() => setActiveTab('workers')}
                      variant="outline"
                      className="w-full"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Find Workers
                    </Button>
                    <Button 
                      data-testid="button-manage-equipment"
                      onClick={() => setActiveTab('equipment')}
                      variant="outline"
                      className="w-full"
                    >
                      <Wrench className="h-4 w-4 mr-2" />
                      Manage Equipment
                    </Button>
                    <Button 
                      data-testid="button-vehicle-marketplace"
                      onClick={() => setActiveTab('vehicles')}
                      variant="outline"
                      className="w-full"
                    >
                      <Car className="h-4 w-4 mr-2" />
                      Vehicle Marketplace
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Job Management</h2>
              <Button 
                data-testid="button-create-job"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </div>

            <div className="grid gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                        <p className="text-gray-300 mt-1">{job.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${job.payRate}/{job.payType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job.hiredWorkers}/{job.workersNeeded} workers
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant={job.status === 'open' ? 'default' : 'secondary'}
                          data-testid={`job-status-${job.id}`}
                        >
                          {job.status}
                        </Badge>
                        {job.isUrgent && (
                          <Badge variant="destructive" data-testid={`job-urgent-${job.id}`}>
                            URGENT
                          </Badge>
                        )}
                        <p className="text-sm text-gray-400">{job.totalApplicants} applicants</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" data-testid={`button-view-applicants-${job.id}`}>
                          View Applicants
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-edit-job-${job.id}`}>
                          Edit Job
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Worker Management</h2>
              <div className="flex gap-2">
                <Button variant="outline" data-testid="button-hire-worker">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Hire Worker
                </Button>
                <Button variant="outline" data-testid="button-fire-worker">
                  <UserX className="h-4 w-4 mr-2" />
                  Manage Team
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <Card key={worker.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {worker.firstName} {worker.lastName}
                        </h3>
                        <p className="text-gray-300">{worker.city}</p>
                        <p className="text-sm text-gray-400 capitalize">{worker.experienceLevel}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <span>★</span>
                          <span className="font-medium">{worker.rating}</span>
                        </div>
                        <Badge 
                          variant={worker.isAvailable ? 'default' : 'secondary'}
                          className="mt-1"
                          data-testid={`worker-availability-${worker.id}`}
                        >
                          {worker.isAvailable ? 'Available' : 'Busy'}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">
                        {worker.totalJobsCompleted} jobs completed
                      </p>
                      {worker.skills && worker.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {worker.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {worker.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{worker.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1" data-testid={`button-hire-${worker.id}`}>
                        Hire
                      </Button>
                      <Button size="sm" variant="outline" data-testid={`button-contact-${worker.id}`}>
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Equipment Hub System</h2>
              <Button className="bg-orange-600 hover:bg-orange-700" data-testid="button-add-equipment">
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {equipment.map((item) => (
                <Card key={item.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                        <Badge 
                          variant={item.isAvailable ? 'default' : 'secondary'}
                          data-testid={`equipment-status-${item.id}`}
                        >
                          {item.isAvailable ? 'Available' : 'In Use'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 capitalize">{item.category}</p>
                        <p className="text-xs text-gray-400 capitalize">{item.condition} condition</p>
                        <p className="text-sm text-green-400 font-medium">
                          ${item.dailyRate}/day
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" data-testid={`button-checkout-${item.id}`}>
                          Checkout
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-details-${item.id}`}>
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Global Vehicle Marketplace</h2>
              <Button className="bg-purple-600 hover:bg-purple-700" data-testid="button-list-vehicle">
                <Plus className="h-4 w-4 mr-2" />
                List Vehicle
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>
                          <p className="text-gray-300">{vehicle.city}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-400">
                            ${vehicle.price.toLocaleString()}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {vehicle.condition}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" data-testid={`button-view-vehicle-${vehicle.id}`}>
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-contact-seller-${vehicle.id}`}>
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Company Management</h2>
              <Button className="bg-indigo-600 hover:bg-indigo-700" data-testid="button-create-company">
                <Plus className="h-4 w-4 mr-2" />
                Create Company
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {companies.map((company) => (
                <Card key={company.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{company.name}</h3>
                          <p className="text-gray-300 capitalize">{company.industry}</p>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <span>★</span>
                          <span className="font-medium">{company.rating}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Active Jobs</p>
                          <p className="text-white font-medium">{company.activeJobs}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Total Jobs</p>
                          <p className="text-white font-medium">{company.totalJobs}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" data-testid={`button-manage-company-${company.id}`}>
                          Manage
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-view-jobs-${company.id}`}>
                          View Jobs
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Workforce Analytics</h2>
              <Button variant="outline" data-testid="button-export-analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Job Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-400">94.7%</p>
                  <p className="text-xs text-gray-400">Jobs completed successfully</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Average Worker Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-400">4.8★</p>
                  <p className="text-xs text-gray-400">Based on client reviews</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Equipment Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-400">87%</p>
                  <p className="text-xs text-gray-400">Equipment actively in use</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Revenue This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-400">$125K</p>
                  <p className="text-xs text-gray-400">+18% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}