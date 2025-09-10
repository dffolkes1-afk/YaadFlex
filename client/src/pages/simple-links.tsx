import { Link } from 'wouter';
import { MapPin, Car, Users, Building, Truck, Phone, CreditCard, Radio } from 'lucide-react';

export default function SimpleLinksPage() {
  return (
    <div className="min-h-screen text-[#e6eef6]" style={{
      background: `
        radial-gradient(1200px 600px at 70% -10%, rgba(109,167,255,0.10), transparent 60%),
        radial-gradient(900px 500px at 10% -10%, rgba(180,197,214,0.08), transparent 60%),
        #0c1116
      `
    }}>
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">YaadFlex Platform</h1>
          <p className="text-[#9fb0c2]">Professional transportation and business services</p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          
          <Link href="/ride-booking">
            <div className="p-6 border border-[#1b2633] rounded-2xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#6da7ff] to-[#8ec1ff] flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-[#06101a]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Book Ride</h3>
                  <p className="text-[#9fb0c2] text-sm">Professional drivers across Jamaica</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/driver-registration">
            <div className="p-6 border border-[#1b2633] rounded-2xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Drive & Earn</h3>
                  <p className="text-[#9fb0c2] text-sm">Join our driver network - 85% earnings</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/business-registration">
            <div className="p-6 border border-[#1b2633] rounded-2xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Business Services</h3>
                  <p className="text-[#9fb0c2] text-sm">Register your business on our platform</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/premium-storefront">
            <div className="p-6 border border-[#1b2633] rounded-2xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Marketplace</h3>
                  <p className="text-[#9fb0c2] text-sm">Premium storefronts and vendors</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/contactless">
            <div className="p-6 border border-[#1b2633] rounded-2xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Delivery</h3>
                  <p className="text-[#9fb0c2] text-sm">Fast and reliable delivery services</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/cb-radio">
            <div className="p-6 border border-[#1b2633] rounded-2xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center">
                  <Radio className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Driver Network</h3>
                  <p className="text-[#9fb0c2] text-sm">Communication and coordination</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/banking">
            <div className="p-6 border border-[#1b2633] rounded-2xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Banking</h3>
                  <p className="text-[#9fb0c2] text-sm">Payments and financial services</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/real-estate">
            <div className="p-6 border border-[#1b2633] rounded-2xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Real Estate</h3>
                  <p className="text-[#9fb0c2] text-sm">Property listings and services</p>
                </div>
              </div>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-[#9fb0c2] text-sm">
          Professional services • Trusted platform • Caribbean innovation
        </div>

      </div>
    </div>
  );
}