import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wrench, 
  PaintBucket, 
  Zap, 
  Droplets, 
  Snowflake, 
  Truck, 
  Leaf, 
  Shield,
  HardHat,
  Wifi,
  Sparkles,
  Hammer,
  Home,
  Building2,
  FlaskConical
} from "lucide-react";
import serviceCategories from "../../../shared/service-categories.json";

const categoryIcons = {
  warm_renovation: Home,
  office_renovation: Building2,
  chemical_services: FlaskConical,
  cleaning: Sparkles,
  handyman: Hammer,
  painting: PaintBucket,
  hvac: Snowflake,
  electrical: Zap,
  plumbing: Droplets,
  fitout: Wrench,
  moving: Truck,
  outdoor: Leaf,
  sanitation_pest: Shield,
  construction_lite: HardHat,
  it_office: Wifi,
};

export default function ServiceMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState(serviceCategories.categories[0]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPriceRange = (category: any) => {
    const pricing = category.samplePricing;
    if (pricing.per_room_min && pricing.per_room_max) {
      return `${formatPrice(pricing.per_room_min)} - ${formatPrice(pricing.per_room_max)} per room`;
    }
    if (pricing.per_sq_ft_min && pricing.per_sq_ft_max) {
      return `${formatPrice(pricing.per_sq_ft_min)} - ${formatPrice(pricing.per_sq_ft_max)} per sq ft`;
    }
    if (pricing.job_min && pricing.job_max) {
      return `${formatPrice(pricing.job_min)} - ${formatPrice(pricing.job_max)} per job`;
    }
    if (pricing.install_min && pricing.install_max) {
      return `${formatPrice(pricing.install_min)} - ${formatPrice(pricing.install_max)} install`;
    }
    if (pricing.outlet_min && pricing.outlet_max) {
      return `${formatPrice(pricing.outlet_min)} - ${formatPrice(pricing.outlet_max)} per outlet`;
    }
    if (pricing.unclog_min && pricing.unclog_max) {
      return `${formatPrice(pricing.unclog_min)} - ${formatPrice(pricing.unclog_max)}`;
    }
    if (pricing.tv_mount_min && pricing.tv_mount_max) {
      return `${formatPrice(pricing.tv_mount_min)} - ${formatPrice(pricing.tv_mount_max)}`;
    }
    if (pricing.pressure_min && pricing.pressure_max) {
      return `${formatPrice(pricing.pressure_min)} - ${formatPrice(pricing.pressure_max)} per sq ft`;
    }
    if (pricing.home_min && pricing.home_max) {
      return `${formatPrice(pricing.home_min)} - ${formatPrice(pricing.home_max)} per home`;
    }
    if (pricing.linear_ft_min && pricing.linear_ft_max) {
      return `${formatPrice(pricing.linear_ft_min)} - ${formatPrice(pricing.linear_ft_max)} per linear ft`;
    }
    if (pricing.drop_min && pricing.drop_max) {
      return `${formatPrice(pricing.drop_min)} - ${formatPrice(pricing.drop_max)} per drop`;
    }
    return 'Contact for pricing';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🏆 YaadFlex Service Empire
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            15 Professional Service Categories | Jamaica's Complete Solution
          </p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            🇯🇲 Caribbean's First Integrated Service Platform
          </Badge>
        </div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {serviceCategories.categories.map((category) => {
            const IconComponent = categoryIcons[category.code as keyof typeof categoryIcons];
            return (
              <Card 
                key={category.code}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedCategory.code === category.code 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedCategory(category)}
                data-testid={`category-card-${category.code}`}
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold text-sm">{category.label}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {getPriceRange(category)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Category Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              {(() => {
                const IconComponent = categoryIcons[selectedCategory.code as keyof typeof categoryIcons];
                return <IconComponent className="h-12 w-12 text-blue-600" />;
              })()}
              <div>
                <CardTitle className="text-2xl">{selectedCategory.label}</CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  {getPriceRange(selectedCategory)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
                <TabsTrigger value="fleet">Fleet</TabsTrigger>
              </TabsList>
              
              <TabsContent value="services" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedCategory.subs.map((sub, index) => (
                    <Badge key={index} variant="outline" className="justify-center p-3">
                      {sub.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pricing" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Available Units:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory.units.map((unit, index) => (
                        <Badge key={index} variant="secondary">
                          {unit.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Sample Pricing (JMD):</h4>
                    <p className="text-lg font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded">
                      {getPriceRange(selectedCategory)}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="safety" className="mt-6">
                {selectedCategory.safety ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedCategory.safety.map((item, index) => (
                      <Badge key={index} variant="destructive" className="justify-center p-3">
                        {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Standard safety protocols apply</p>
                )}
              </TabsContent>
              
              <TabsContent value="fleet" className="mt-6">
                {selectedCategory.fleet ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedCategory.fleet.map((vehicle, index) => (
                      <Badge key={index} variant="outline" className="justify-center p-3">
                        🚗 {vehicle.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Standard fleet vehicles</p>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex gap-4">
              <Button 
                className="flex-1" 
                data-testid="button-request-service"
              >
                📞 Request This Service
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                data-testid="button-get-quote"
              >
                💰 Get Quote
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* YaadFlex Advantage */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-bold mb-4">🚀 YaadFlex Service Advantage</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">📡 Professional Tracking</h4>
                <p className="text-sm">Real-time service provider location and progress monitoring</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">📻 CB Radio Network</h4>
                <p className="text-sm">Direct communication with service teams like professional contractors</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">💳 Multi-Currency Payments</h4>
                <p className="text-sm">Pay in JMD, USD, KWD, or YFD with secure escrow protection</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}