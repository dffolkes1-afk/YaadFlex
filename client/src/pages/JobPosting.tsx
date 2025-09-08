import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Briefcase, MapPin, Users, DollarSign, Calendar, Clock, Wrench, AlertTriangle } from 'lucide-react';

const jobFormSchema = z.object({
  title: z.string().min(5, 'Job title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  jobType: z.string().min(1, 'Please select a job type'),
  skillLevel: z.string().min(1, 'Please select a skill level'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  payRate: z.number().min(1, 'Pay rate must be greater than 0'),
  payType: z.string().min(1, 'Please select pay type'),
  currency: z.string().default('JMD'),
  workersNeeded: z.number().min(1, 'At least 1 worker needed'),
  supervisorsNeeded: z.number().min(0, 'Supervisors needed cannot be negative'),
  equipmentProvided: z.boolean().default(false),
  isUrgent: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  applicationDeadline: z.string().optional(),
  workingHours: z.string().optional(),
  estimatedDuration: z.number().optional(),
  companyId: z.string().min(1, 'Please select a company')
});

type JobFormData = z.infer<typeof jobFormSchema>;

interface Company {
  id: string;
  name: string;
  industry: string;
}

export default function JobPosting() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's companies
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
    enabled: !!user
  });

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      jobType: '',
      skillLevel: 'entry',
      address: '',
      city: '',
      startDate: '',
      endDate: '',
      payRate: 25,
      payType: 'hourly',
      currency: 'JMD',
      workersNeeded: 1,
      supervisorsNeeded: 0,
      equipmentProvided: false,
      isUrgent: false,
      isPublic: true,
      applicationDeadline: '',
      workingHours: '',
      estimatedDuration: 8,
      companyId: ''
    }
  });

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: (jobData: JobFormData) => apiRequest('/api/jobs', 'POST', {
      ...jobData,
      startDate: new Date(jobData.startDate).toISOString().split('T')[0],
      endDate: jobData.endDate ? new Date(jobData.endDate).toISOString().split('T')[0] : null,
      applicationDeadline: jobData.applicationDeadline ? new Date(jobData.applicationDeadline).toISOString().split('T')[0] : null
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({ 
        title: 'Success! 🎉', 
        description: 'Job posted successfully! Workers can now apply.' 
      });
      form.reset();
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to post job. Please try again.', 
        variant: 'destructive' 
      });
    }
  });

  const onSubmit = (data: JobFormData) => {
    createJobMutation.mutate(data);
  };

  const jobTypes = [
    { value: 'maintenance', label: 'Maintenance & Repairs', icon: '🔧' },
    { value: 'cleanup', label: 'Cleanup & Sanitation', icon: '🧹' },
    { value: 'construction', label: 'Construction', icon: '🏗️' },
    { value: 'delivery', label: 'Delivery & Transport', icon: '🚚' },
    { value: 'automotive', label: 'Automotive Services', icon: '🚗' },
    { value: 'landscaping', label: 'Landscaping', icon: '🌱' },
    { value: 'security', label: 'Security Services', icon: '🛡️' },
    { value: 'electrical', label: 'Electrical Work', icon: '⚡' },
    { value: 'plumbing', label: 'Plumbing Services', icon: '🔧' },
    { value: 'painting', label: 'Painting & Finishing', icon: '🎨' }
  ];

  const skillLevels = [
    { value: 'entry', label: 'Entry Level', description: 'No experience required' },
    { value: 'intermediate', label: 'Intermediate', description: '1-3 years experience' },
    { value: 'expert', label: 'Expert', description: '3+ years experience' },
    { value: 'supervisor', label: 'Supervisor', description: 'Leadership experience required' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Post a New Job</h1>
              <p className="text-gray-300">
                Create jobs for maintenance, cleanup, construction, and more across the Caribbean
              </p>
            </div>
          </div>
        </div>

        {/* Job Form */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Job Details</CardTitle>
            <CardDescription className="text-gray-300">
              Fill out the details below to post your job and start receiving applications from qualified workers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Company Selection */}
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Company *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-company">
                            <SelectValue placeholder="Select a company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name} ({company.industry})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Basic Job Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Job Title *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="e.g. Building Maintenance Technician"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            data-testid="input-job-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Job Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-job-type">
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.icon} {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Job Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Job Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the job responsibilities, requirements, and what you're looking for in a worker..."
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                          data-testid="textarea-job-description"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Be specific about the work involved, safety requirements, and what makes this job unique.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Address *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Street address where work will be performed"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            data-testid="input-job-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">City *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="e.g. Kingston, Montego Bay, Spanish Town"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            data-testid="input-job-city"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Pay Information */}
                <div className="grid md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="payRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Pay Rate *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            min="1"
                            step="0.01"
                            placeholder="25.00"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            data-testid="input-pay-rate"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Pay Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-pay-type">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hourly">Per Hour</SelectItem>
                            <SelectItem value="daily">Per Day</SelectItem>
                            <SelectItem value="project">Per Project</SelectItem>
                            <SelectItem value="commission">Commission</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-currency">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="JMD">JMD (Jamaican Dollar)</SelectItem>
                            <SelectItem value="USD">USD (US Dollar)</SelectItem>
                            <SelectItem value="KWD">KWD (Kuwaiti Dinar)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Skill Level and Team Size */}
                <div className="grid md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="skillLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Skill Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-skill-level">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {skillLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label} - {level.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workersNeeded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Workers Needed *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            min="1"
                            placeholder="1"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            data-testid="input-workers-needed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supervisorsNeeded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Supervisors Needed</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            min="0"
                            placeholder="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            data-testid="input-supervisors-needed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Dates */}
                <div className="grid md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Start Date *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date"
                            className="bg-white/10 border-white/20 text-white"
                            data-testid="input-start-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">End Date (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date"
                            className="bg-white/10 border-white/20 text-white"
                            data-testid="input-end-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applicationDeadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Application Deadline (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date"
                            className="bg-white/10 border-white/20 text-white"
                            data-testid="input-application-deadline"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="workingHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Working Hours</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="e.g. 8am-4pm, flexible, night shift"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            data-testid="input-working-hours"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimatedDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Estimated Duration (Hours)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            min="1"
                            placeholder="8"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            data-testid="input-estimated-duration"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="equipmentProvided"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-equipment-provided"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white cursor-pointer">
                            Equipment Provided
                          </FormLabel>
                          <FormDescription className="text-gray-400">
                            Check if you will provide all necessary tools and equipment for this job.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isUrgent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-urgent-job"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white cursor-pointer flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            Urgent Job
                          </FormLabel>
                          <FormDescription className="text-gray-400">
                            Mark as urgent to get priority placement and faster responses.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-public-job"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white cursor-pointer">
                            Public Job Listing
                          </FormLabel>
                          <FormDescription className="text-gray-400">
                            Allow all workers to see and apply for this job. Uncheck for private/invite-only jobs.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={createJobMutation.isPending}
                    data-testid="button-submit-job"
                  >
                    {createJobMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Posting Job...
                      </>
                    ) : (
                      <>
                        <Briefcase className="h-4 w-4 mr-2" />
                        Post Job & Start Hiring
                      </>
                    )}
                  </Button>

                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={createJobMutation.isPending}
                    data-testid="button-reset-form"
                  >
                    Clear Form
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}