import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plane, Hotel, Car, MapPin, Calendar, Users, Clock, Star, Phone, Mail, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TravelBooking() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("flights");

  const popularDestinations = [
    { name: "Miami, USA", code: "MIA", price: "J$45,000", image: "🏖️", rating: 4.8 },
    { name: "London, UK", code: "LHR", price: "J$85,000", image: "🏰", rating: 4.9 },
    { name: "Toronto, Canada", code: "YYZ", price: "J$65,000", image: "🍁", rating: 4.7 },
    { name: "New York, USA", code: "JFK", price: "J$75,000", image: "🗽", rating: 4.8 },
    { name: "Barbados", code: "BGI", price: "J$35,000", image: "🌴", rating: 4.6 },
    { name: "Trinidad", code: "POS", price: "J$28,000", image: "🎭", rating: 4.5 },
  ];

  const featuredPackages = [
    {
      name: "Caribbean Paradise",
      destination: "Barbados",
      duration: "7 days",
      price: "J$120,000",
      includes: ["Flight", "4-star hotel", "Meals", "Tours"],
      image: "🏝️"
    },
    {
      name: "Business Express",
      destination: "Miami",
      duration: "3 days",
      price: "J$85,000",
      includes: ["Flight", "Business hotel", "Airport transfer"],
      image: "🏢"
    },
    {
      name: "Family Adventure",
      destination: "Orlando",
      duration: "5 days",
      price: "J$150,000",
      includes: ["Flight", "Family resort", "Theme park tickets"],
      image: "🎢"
    }
  ];

  const handleBookingSubmit = (type: string) => {
    toast({
      title: "Booking Request Submitted!",
      description: `Your ${type} booking request has been submitted. Our travel agents will contact you within 2 hours with confirmation and payment details.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Plane className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                YaadFlex Travel Agent
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Book flights, hotels, cars & packages worldwide - We earn 8% commission to help you travel better
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Plane className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Airlines</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Hotel className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">50,000+</div>
              <div className="text-gray-600 dark:text-gray-300">Hotels</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Car className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">1,000+</div>
              <div className="text-gray-600 dark:text-gray-300">Car Rentals</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">200+</div>
              <div className="text-gray-600 dark:text-gray-300">Destinations</div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Destinations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Popular Destinations from Jamaica
            </CardTitle>
            <CardDescription>Best flight deals updated daily</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularDestinations.map((dest, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" data-testid={`destination-${dest.code}`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{dest.image}</div>
                    <div className="font-semibold text-sm">{dest.name}</div>
                    <div className="text-xs text-gray-500">{dest.code}</div>
                    <div className="text-green-600 font-bold text-sm">{dest.price}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs">{dest.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Booking Interface */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Book Your Travel</CardTitle>
            <CardDescription>Complete travel booking platform with 8% commission structure</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="flights" className="flex items-center gap-2" data-testid="tab-flights">
                  <Plane className="h-4 w-4" />
                  Flights
                </TabsTrigger>
                <TabsTrigger value="hotels" className="flex items-center gap-2" data-testid="tab-hotels">
                  <Hotel className="h-4 w-4" />
                  Hotels
                </TabsTrigger>
                <TabsTrigger value="cars" className="flex items-center gap-2" data-testid="tab-cars">
                  <Car className="h-4 w-4" />
                  Car Rental
                </TabsTrigger>
                <TabsTrigger value="packages" className="flex items-center gap-2" data-testid="tab-packages">
                  <MapPin className="h-4 w-4" />
                  Packages
                </TabsTrigger>
              </TabsList>

              {/* Flight Booking */}
              <TabsContent value="flights" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="from">From</Label>
                    <Select>
                      <SelectTrigger data-testid="select-departure">
                        <SelectValue placeholder="Kingston (KIN)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kin">Kingston (KIN)</SelectItem>
                        <SelectItem value="mbj">Montego Bay (MBJ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="to">To</Label>
                    <Select>
                      <SelectTrigger data-testid="select-destination">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mia">Miami (MIA)</SelectItem>
                        <SelectItem value="jfk">New York (JFK)</SelectItem>
                        <SelectItem value="lhr">London (LHR)</SelectItem>
                        <SelectItem value="yyz">Toronto (YYZ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="departure">Departure</Label>
                    <Input type="date" data-testid="input-departure-date" />
                  </div>
                  <div>
                    <Label htmlFor="return">Return (Optional)</Label>
                    <Input type="date" data-testid="input-return-date" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="passengers">Passengers</Label>
                    <Select>
                      <SelectTrigger data-testid="select-passengers">
                        <SelectValue placeholder="1 Adult" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Adult</SelectItem>
                        <SelectItem value="2">2 Adults</SelectItem>
                        <SelectItem value="3">3 Adults</SelectItem>
                        <SelectItem value="4">4+ Adults</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="class">Class</Label>
                    <Select>
                      <SelectTrigger data-testid="select-class">
                        <SelectValue placeholder="Economy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="mt-6" onClick={() => handleBookingSubmit("flight")} data-testid="button-search-flights">
                    Search Flights
                  </Button>
                </div>
              </TabsContent>

              {/* Hotel Booking */}
              <TabsContent value="hotels" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="city">City/Destination</Label>
                    <Input placeholder="Enter city name" data-testid="input-hotel-city" />
                  </div>
                  <div>
                    <Label htmlFor="checkin">Check-in</Label>
                    <Input type="date" data-testid="input-checkin" />
                  </div>
                  <div>
                    <Label htmlFor="checkout">Check-out</Label>
                    <Input type="date" data-testid="input-checkout" />
                  </div>
                  <div>
                    <Label htmlFor="guests">Guests</Label>
                    <Select>
                      <SelectTrigger data-testid="select-guests">
                        <SelectValue placeholder="2 Adults, 1 Room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1adult">1 Adult, 1 Room</SelectItem>
                        <SelectItem value="2adult">2 Adults, 1 Room</SelectItem>
                        <SelectItem value="family">2 Adults, 2 Children, 1 Room</SelectItem>
                        <SelectItem value="multiple">Multiple Rooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="stars">Star Rating</Label>
                    <Select>
                      <SelectTrigger data-testid="select-stars">
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any rating</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="5">5 Stars Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amenities">Amenities</Label>
                    <Select>
                      <SelectTrigger data-testid="select-amenities">
                        <SelectValue placeholder="Select amenities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wifi">Free WiFi</SelectItem>
                        <SelectItem value="pool">Swimming Pool</SelectItem>
                        <SelectItem value="gym">Fitness Center</SelectItem>
                        <SelectItem value="spa">Spa Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="mt-6" onClick={() => handleBookingSubmit("hotel")} data-testid="button-search-hotels">
                    Search Hotels
                  </Button>
                </div>
              </TabsContent>

              {/* Car Rental */}
              <TabsContent value="cars" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="pickup-location">Pickup Location</Label>
                    <Input placeholder="Airport/City" data-testid="input-pickup-location" />
                  </div>
                  <div>
                    <Label htmlFor="pickup-date">Pickup Date</Label>
                    <Input type="datetime-local" data-testid="input-pickup-date" />
                  </div>
                  <div>
                    <Label htmlFor="dropoff-date">Drop-off Date</Label>
                    <Input type="datetime-local" data-testid="input-dropoff-date" />
                  </div>
                  <div>
                    <Label htmlFor="car-type">Car Type</Label>
                    <Select>
                      <SelectTrigger data-testid="select-car-type">
                        <SelectValue placeholder="Any car type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="midsize">Midsize</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="driver-age">Driver Age</Label>
                    <Select>
                      <SelectTrigger data-testid="select-driver-age">
                        <SelectValue placeholder="25+ years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-24">18-24 years</SelectItem>
                        <SelectItem value="25-64">25-64 years</SelectItem>
                        <SelectItem value="65+">65+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select>
                      <SelectTrigger data-testid="select-transmission">
                        <SelectValue placeholder="Automatic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="mt-6" onClick={() => handleBookingSubmit("car rental")} data-testid="button-search-cars">
                    Search Cars
                  </Button>
                </div>
              </TabsContent>

              {/* Travel Packages */}
              <TabsContent value="packages" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredPackages.map((pkg, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`package-${index}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl">{pkg.image}</div>
                          <Badge variant="secondary">{pkg.duration}</Badge>
                        </div>
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        <CardDescription>{pkg.destination}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-2xl font-bold text-green-600">{pkg.price}</div>
                          <div>
                            <div className="font-semibold text-sm mb-2">Includes:</div>
                            <div className="flex flex-wrap gap-1">
                              {pkg.includes.map((item, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{item}</Badge>
                              ))}
                            </div>
                          </div>
                          <Button className="w-full" onClick={() => handleBookingSubmit("package")} data-testid={`button-book-package-${index}`}>
                            Book Package
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Need Help? Contact Our Travel Experts
            </CardTitle>
            <CardDescription>Professional travel agents available 24/7</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold">Call Us</div>
                  <div className="text-gray-600 dark:text-gray-300">+1-876-YAD-FLEX</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-semibold">Email Us</div>
                  <div className="text-gray-600 dark:text-gray-300">travel@yaadflexglobalvybz.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-semibold">Hours</div>
                  <div className="text-gray-600 dark:text-gray-300">24/7 Support Available</div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Commission Structure</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                YaadFlex earns 8% commission on all travel bookings to maintain our platform and provide excellent service. 
                This ensures competitive prices while supporting our operations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}