import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Package, 
  MapPin, 
  DollarSign, 
  Clock,
  Truck,
  Calculator,
  Phone,
  User,
  Plus,
  Minus,
  AlertCircle
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface DeliveryCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  baseRate: string;
  ratePerKm: string;
  minFee: string;
  maxFee?: string;
  requiresSpecialHandling: boolean;
  allowedVehicleTypes: string[];
}

interface DeliveryArea {
  id: string;
  code: string;
  name: string;
  description: string;
  deliveryFeeMultiplier: string;
  estimatedDeliveryTime: number;
}

interface OrderItem {
  name: string;
  description?: string;
  quantity: number;
  value?: number;
}

const deliveryOrderSchema = z.object({
  deliveryType: z.string().min(1, "Please select delivery type"),
  pickupAddress: z.string().min(10, "Pickup address is required"),
  pickupLat: z.number(),
  pickupLng: z.number(),
  pickupContactName: z.string().optional(),
  pickupContactPhone: z.string().optional(),
  pickupInstructions: z.string().optional(),
  deliveryAddress: z.string().min(10, "Delivery address is required"),
  deliveryLat: z.number(),
  deliveryLng: z.number(),
  deliveryContactName: z.string().min(2, "Contact name is required"),
  deliveryContactPhone: z.string().min(10, "Contact phone is required"),
  deliveryInstructions: z.string().optional(),
  items: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    quantity: z.number().min(1),
    value: z.number().optional()
  })).min(1, "At least one item is required"),
  priority: z.string().default('normal'),
  scheduledPickupTime: z.string().optional(),
  scheduledDeliveryTime: z.string().optional(),
  paymentMethod: z.string().default('cash')
});

type DeliveryOrderForm = z.infer<typeof deliveryOrderSchema>;

export default function DeliveryBooking() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<DeliveryCategory[]>([]);
  const [areas, setAreas] = useState<DeliveryArea[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DeliveryCategory | null>(null);
  const [feeEstimate, setFeeEstimate] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([{ name: '', quantity: 1 }]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<DeliveryOrderForm>({
    resolver: zodResolver(deliveryOrderSchema),
    defaultValues: {
      priority: 'normal',
      paymentMethod: 'cash',
      items: [{ name: '', quantity: 1 }]
    }
  });

  const watchedDeliveryType = watch('deliveryType');
  const watchedPickupAddress = watch('pickupAddress');
  const watchedDeliveryAddress = watch('deliveryAddress');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const category = categories.find(c => c.code === watchedDeliveryType);
    setSelectedCategory(category || null);
  }, [watchedDeliveryType, categories]);

  useEffect(() => {
    setValue('items', items);
  }, [items, setValue]);

  const loadInitialData = async () => {
    try {
      const [categoriesRes, areasRes] = await Promise.all([
        apiRequest('GET', '/api/delivery/categories') as Promise<DeliveryCategory[]>,
        apiRequest('GET', '/api/delivery/areas') as Promise<DeliveryArea[]>
      ]);
      
      setCategories(categoriesRes);
      setAreas(areasRes);
    } catch (error: any) {
      toast({
        title: 'Load Failed',
        description: 'Failed to load delivery options',
        variant: 'destructive'
      });
    }
  };

  const calculateFee = async () => {
    if (!watchedDeliveryType || !watchedPickupAddress || !watchedDeliveryAddress) {
      return;
    }

    setCalculating(true);
    try {
      // In a real app, you'd geocode the addresses
      // For demo purposes, using Kingston coordinates
      const pickupLat = 17.9692 + (Math.random() * 0.01);
      const pickupLng = -76.7936 + (Math.random() * 0.01);
      const deliveryLat = 17.9692 + (Math.random() * 0.01);
      const deliveryLng = -76.7936 + (Math.random() * 0.01);

      const estimate = await apiRequest('POST', '/api/delivery/calculate-fee', {
        deliveryType: watchedDeliveryType,
        pickupLat,
        pickupLng,
        deliveryLat,
        deliveryLng
      });

      setFeeEstimate(estimate);
      
      // Set coordinates in form
      setValue('pickupLat', pickupLat);
      setValue('pickupLng', pickupLng);
      setValue('deliveryLat', deliveryLat);
      setValue('deliveryLng', deliveryLng);

    } catch (error: any) {
      toast({
        title: 'Calculation Failed',
        description: error.message || 'Failed to calculate delivery fee',
        variant: 'destructive'
      });
    } finally {
      setCalculating(false);
    }
  };

  const addItem = () => {
    setItems(prev => [...prev, { name: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const onSubmit = async (data: DeliveryOrderForm) => {
    if (!feeEstimate) {
      toast({
        title: 'Fee Required',
        description: 'Please calculate delivery fee first',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        ...data,
        deliveryFee: feeEstimate.estimatedFee,
        totalValue: items.reduce((sum, item) => sum + (item.value || 0), 0)
      };

      const result = await apiRequest('POST', '/api/delivery/orders', orderData);
      
      toast({
        title: 'Order Created!',
        description: `Your delivery order has been placed successfully. Order #: ${result.order.orderNumber}`,
      });

      // Redirect to order tracking or reset form
      window.location.href = '/my-deliveries';
      
    } catch (error: any) {
      toast({
        title: 'Order Failed',
        description: error.message || 'Failed to create delivery order',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <Truck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Book Delivery Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Fast, reliable delivery for all your needs across Jamaica
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Select Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      watchedDeliveryType === category.code 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setValue('deliveryType', category.code)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {category.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      From ${category.minFee} • Base: ${category.baseRate} • +${category.ratePerKm}/km
                    </div>
                    {category.requiresSpecialHandling && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Special Handling
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              {errors.deliveryType && (
                <p className="text-red-500 text-sm mt-2">{errors.deliveryType.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Addresses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pickup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Pickup Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pickupAddress">Pickup Address *</Label>
                  <Textarea
                    id="pickupAddress"
                    {...register('pickupAddress')}
                    placeholder="Enter complete pickup address"
                    className="mt-1"
                  />
                  {errors.pickupAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupAddress.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="pickupContactName">Contact Name</Label>
                    <Input
                      id="pickupContactName"
                      {...register('pickupContactName')}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickupContactPhone">Contact Phone</Label>
                    <Input
                      id="pickupContactPhone"
                      {...register('pickupContactPhone')}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pickupInstructions">Special Instructions</Label>
                  <Textarea
                    id="pickupInstructions"
                    {...register('pickupInstructions')}
                    placeholder="Building entrance, floor, etc."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                  <Textarea
                    id="deliveryAddress"
                    {...register('deliveryAddress')}
                    placeholder="Enter complete delivery address"
                    className="mt-1"
                  />
                  {errors.deliveryAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="deliveryContactName">Contact Name *</Label>
                    <Input
                      id="deliveryContactName"
                      {...register('deliveryContactName')}
                      placeholder="Recipient name"
                    />
                    {errors.deliveryContactName && (
                      <p className="text-red-500 text-sm mt-1">{errors.deliveryContactName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="deliveryContactPhone">Contact Phone *</Label>
                    <Input
                      id="deliveryContactPhone"
                      {...register('deliveryContactPhone')}
                      placeholder="Phone number"
                    />
                    {errors.deliveryContactPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.deliveryContactPhone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="deliveryInstructions">Special Instructions</Label>
                  <Textarea
                    id="deliveryInstructions"
                    {...register('deliveryInstructions')}
                    placeholder="Building entrance, floor, etc."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Items to Deliver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Input
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Description (optional)"
                        value={item.description || ''}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Quantity"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Value ($) optional"
                        value={item.value || ''}
                        onChange={(e) => updateItem(index, 'value', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Options & Fee Calculation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select onValueChange={(value) => setValue('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (+$0)</SelectItem>
                      <SelectItem value="normal">Normal (+$0)</SelectItem>
                      <SelectItem value="high">High (+$3)</SelectItem>
                      <SelectItem value="urgent">Urgent (+$5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select onValueChange={(value) => setValue('paymentMethod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash on Delivery</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="wallet">YaadFlex Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="scheduledPickupTime">Pickup Time (Optional)</Label>
                    <Input
                      id="scheduledPickupTime"
                      type="datetime-local"
                      {...register('scheduledPickupTime')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheduledDeliveryTime">Delivery Time (Optional)</Label>
                    <Input
                      id="scheduledDeliveryTime"
                      type="datetime-local"
                      {...register('scheduledDeliveryTime')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fee Calculation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Delivery Fee
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!feeEstimate ? (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Calculate your delivery fee
                    </p>
                    <Button 
                      type="button"
                      onClick={calculateFee}
                      disabled={calculating || !watchedDeliveryType || !watchedPickupAddress || !watchedDeliveryAddress}
                    >
                      {calculating ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Calculator className="w-4 h-4 mr-2" />
                          Calculate Fee
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b">
                      <span>Distance:</span>
                      <span className="font-medium">{feeEstimate.distance} km</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span>Base Fee:</span>
                      <span>${selectedCategory?.baseRate}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span>Distance Fee:</span>
                      <span>${((feeEstimate.distance || 0) * Number(selectedCategory?.ratePerKm || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 text-lg font-bold">
                      <span>Total Fee:</span>
                      <span className="text-green-600">${feeEstimate.estimatedFee}</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={calculateFee}
                      disabled={calculating}
                    >
                      Recalculate
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submit */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ready to place your order?</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You will be able to track your delivery in real-time
                  </p>
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={submitting || !feeEstimate}
                  className="min-w-32"
                >
                  {submitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4 mr-2" />
                      Book Delivery
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}