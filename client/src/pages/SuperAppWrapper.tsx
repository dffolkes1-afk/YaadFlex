import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { serviceConfigs, categories, getServicesByCategory } from "@/config/services";
import { Link } from "wouter";

export default function SuperAppWrapper() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'native':
        return <Badge className="bg-yellow-500 text-black" data-testid={`badge-native`}>YardFlex Native</Badge>;
      case 'wrapped':
        return <Badge className="bg-blue-500" data-testid={`badge-wrapped`}>Powered by YardFlex</Badge>;
      case 'coming-soon':
        return <Badge variant="outline" data-testid={`badge-coming-soon`}>Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-header-title">
            🌴 YardFlex Super-App Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300" data-testid="text-header-subtitle">
            All your favorite apps, wrapped in the YardFlex ecosystem
          </p>
          <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 p-4 mt-6 rounded-r-lg">
            <p className="text-yellow-800 dark:text-yellow-200 font-medium" data-testid="text-value-prop">
              <strong>One Home, Many Doors:</strong> Access Instagram, TikTok, Uber, PayPal & more - all inside YardFlex!
            </p>
          </div>
        </div>

        {/* Categories */}
        {categories.map(category => {
          const categoryServices = getServicesByCategory(category.id);
          const CategoryIcon = category.icon;
          
          return (
            <div key={category.id} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <CategoryIcon className="w-6 h-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid={`text-category-${category.id}`}>
                  {category.name}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoryServices.map((service) => {
                  const ServiceIcon = service.icon;
                  const linkTo = service.status === 'native' && service.nativeRoute 
                    ? service.nativeRoute 
                    : service.status === 'wrapped' 
                    ? `/wrapper/${service.slug}`
                    : '#';
                  
                  return (
                    <div key={service.slug}>
                      {service.status === 'coming-soon' ? (
                        <Card 
                          className="hover:shadow-lg transition-shadow opacity-60"
                          data-testid={`card-service-${service.slug}`}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                                <ServiceIcon className="w-6 h-6 text-white" />
                              </div>
                              {getStatusBadge(service.status)}
                            </div>
                            <CardTitle className="text-lg font-semibold" data-testid={`text-service-name-${service.slug}`}>
                              {service.displayName}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-400" data-testid={`text-service-description-${service.slug}`}>
                              {service.description}
                            </p>
                            <Button 
                              className="w-full mt-3"
                              variant="outline"
                              disabled={true}
                              data-testid={`button-open-${service.slug}`}
                            >
                              Coming Soon
                            </Button>
                          </CardContent>
                        </Card>
                      ) : (
                        <Link to={linkTo}>
                          <Card 
                            className="hover:shadow-lg transition-shadow cursor-pointer group"
                            data-testid={`card-service-${service.slug}`}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                                  <ServiceIcon className="w-6 h-6 text-white" />
                                </div>
                                {getStatusBadge(service.status)}
                              </div>
                              <CardTitle className="text-lg font-semibold" data-testid={`text-service-name-${service.slug}`}>
                                {service.displayName}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 dark:text-gray-400" data-testid={`text-service-description-${service.slug}`}>
                                {service.description}
                              </p>
                              <Button 
                                className="w-full mt-3 group-hover:bg-yellow-500 transition-colors"
                                variant="outline"
                                data-testid={`button-open-${service.slug}`}
                              >
                                Open in YardFlex
                              </Button>
                            </CardContent>
                          </Card>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Footer Branding */}
        <div className="text-center mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2" data-testid="text-footer-title">
            🔥 YardFlex: The Fair Alternative
          </h3>
          <p className="text-gray-600 dark:text-gray-400" data-testid="text-footer-description">
            All external services run through YardFlex infrastructure - keeping your data secure and earnings fair.
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 font-medium" data-testid="text-revenue-model">
            Revenue flows through YardFlex Wallet • Fair cuts for everyone • Caribbean-first platform
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <Link to="/ride-booking">
              <Button size="sm" variant="outline" data-testid="button-native-rides">YardFlex Rides</Button>
            </Link>
            <Link to="/wallet">
              <Button size="sm" variant="outline" data-testid="button-native-wallet">YardFlex Wallet</Button>
            </Link>
            <Link to="/media-hub">
              <Button size="sm" variant="outline" data-testid="button-native-media">YardFlex Media</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}