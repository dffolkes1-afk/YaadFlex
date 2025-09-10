import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';
import { 
  MapPin, Clock, DollarSign, Users, Globe, Search, Filter,
  Truck, Car, Building2, Wrench, Coffee, Heart, Shield
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract' | 'gig';
  category: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
  urgent: boolean;
  remote: boolean;
}

export default function GlobalJobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample global job opportunities
  const globalJobs: Job[] = [
    {
      id: '1',
      title: 'YaadFlex Driver Partner',
      company: 'YaadFlex Global',
      location: 'Kingston',
      country: 'Jamaica',
      salary: '85% of fare earnings',
      type: 'gig',
      category: 'Transportation',
      description: 'Join the YaadFlex revolution! Earn 85% of every fare - the highest rate in the Caribbean. Drive when you want, where you want.',
      requirements: ['Valid driver\'s license', 'Own vehicle or partner vehicle', 'Clean driving record', 'Smartphone'],
      benefits: ['85% earnings rate', 'Flexible schedule', 'Weekly payouts', 'Insurance coverage', 'Community support'],
      posted: '2 hours ago',
      urgent: true,
      remote: false
    },
    {
      id: '2', 
      title: 'Delivery Driver - UPS Style',
      company: 'YaadFlex Logistics',
      location: 'Montego Bay',
      country: 'Jamaica',
      salary: 'JMD 3,500-5,000/day',
      type: 'full-time',
      category: 'Logistics',
      description: 'Fast-paced package delivery across Montego Bay. Same day delivery service with competitive pay and growth opportunities.',
      requirements: ['Commercial license preferred', 'Physical fitness', 'Customer service skills', 'Local area knowledge'],
      benefits: ['Health insurance', 'Performance bonuses', 'Career advancement', 'Paid training'],
      posted: '1 day ago',
      urgent: false,
      remote: false
    },
    {
      id: '3',
      title: 'Remote Customer Success Manager',
      company: 'YaadFlex International',
      location: 'Remote',
      country: 'Global',
      salary: 'USD 45,000-65,000/year',
      type: 'full-time',
      category: 'Customer Service',
      description: 'Lead customer success initiatives across multiple Caribbean markets. Help drivers and customers succeed on the platform.',
      requirements: ['3+ years customer success experience', 'Excellent English', 'Caribbean market knowledge', 'CRM experience'],
      benefits: ['100% remote work', 'Health coverage', 'Stock options', 'Professional development'],
      posted: '3 days ago',
      urgent: false,
      remote: true
    },
    {
      id: '4',
      title: 'Automotive Technician',
      company: 'YaadFlex Vehicle Services',
      location: 'Spanish Town',
      country: 'Jamaica',
      salary: 'JMD 80,000-120,000/month',
      type: 'full-time',
      category: 'Automotive',
      description: 'Maintain and repair vehicles in the YaadFlex fleet. Work with modern diagnostic equipment and electric vehicles.',
      requirements: ['Automotive certification', '2+ years experience', 'Diagnostic tools knowledge', 'Electric vehicle training preferred'],
      benefits: ['Tool allowance', 'Continuous training', 'Health benefits', 'Overtime opportunities'],
      posted: '5 days ago',
      urgent: false,
      remote: false
    },
    {
      id: '5',
      title: 'Country Expansion Lead',
      company: 'YaadFlex Global',
      location: 'Port of Spain',
      country: 'Trinidad & Tobago',
      salary: 'USD 55,000-75,000/year',
      type: 'full-time',
      category: 'Business Development',
      description: 'Lead YaadFlex expansion into Trinidad & Tobago. Build partnerships, recruit drivers, and establish operations.',
      requirements: ['Business development experience', 'Local market knowledge', 'Leadership skills', 'Startup experience'],
      benefits: ['Equity package', 'Relocation assistance', 'Performance bonuses', 'Leadership development'],
      posted: '1 week ago',
      urgent: true,
      remote: false
    },
    {
      id: '6',
      title: 'Community Manager - Barbados',
      company: 'YaadFlex Caribbean',
      location: 'Bridgetown',
      country: 'Barbados',
      salary: 'BBD 4,000-6,000/month',
      type: 'full-time',
      category: 'Marketing',
      description: 'Build and engage the YaadFlex community in Barbados. Organize events, manage social media, and support local growth.',
      requirements: ['Social media expertise', 'Event planning experience', 'Local connections', 'Creative mindset'],
      benefits: ['Creative freedom', 'Event budgets', 'Community impact', 'Career growth'],
      posted: '3 days ago',
      urgent: false,
      remote: false
    }
  ];

  const countries = ['Jamaica', 'Trinidad & Tobago', 'Barbados', 'Guyana', 'Global'];
  const categories = ['Transportation', 'Logistics', 'Customer Service', 'Automotive', 'Business Development', 'Marketing'];

  const filteredJobs = globalJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || job.country === selectedCountry;
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    
    return matchesSearch && matchesCountry && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Transportation': return <Car className="h-4 w-4" />;
      case 'Logistics': return <Truck className="h-4 w-4" />;
      case 'Customer Service': return <Heart className="h-4 w-4" />;
      case 'Automotive': return <Wrench className="h-4 w-4" />;
      case 'Business Development': return <Building2 className="h-4 w-4" />;
      case 'Marketing': return <Coffee className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                YaadFlex Global Jobs
              </Link>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Globe className="h-3 w-3 mr-1" />
                3/4 of Every Country
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/social-feed">Social Feed</Link>
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Post a Job
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Jobs for Everyone, Everywhere
              </h1>
              <p className="text-xl opacity-90 mb-6">
                YaadFlex is pushing opportunities to 3/4 of every country worldwide. Join the global movement!
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  Find Jobs
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Hire Talent
                </Button>
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{globalJobs.length}+</div>
              <div className="text-xl">Active Opportunities</div>
              <div className="text-sm opacity-75 mt-2">Across Caribbean & Beyond</div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search jobs, companies, locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-job-search"
                  />
                </div>
              </div>
              
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      {job.urgent && (
                        <Badge variant="destructive" className="bg-red-500">
                          Urgent
                        </Badge>
                      )}
                      {job.remote && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Remote
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}, {job.country}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.posted}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getCategoryIcon(job.category)}
                      {job.category}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {job.type}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{job.description}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Requirements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Benefits:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {job.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="bg-green-600 hover:bg-green-700" data-testid={`button-apply-${job.id}`}>
                    Apply Now
                  </Button>
                  <Button variant="outline" data-testid={`button-save-${job.id}`}>
                    Save Job
                  </Button>
                  <Button variant="outline" data-testid={`button-share-${job.id}`}>
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-8 mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Global YaadFlex Family?</h2>
          <p className="text-xl opacity-90 mb-6">
            We're expanding to 3/4 of every country. Be part of the revolution that's connecting the world through work.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Partner With Us
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}