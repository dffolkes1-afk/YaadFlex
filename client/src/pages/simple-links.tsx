import { Link } from 'wouter';
import { MapPin, Car, Users, Building, Truck, Phone, CreditCard, Radio, Wallet, Briefcase, MessageCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function SimpleLinksPage() {
  return (
    <div className="min-h-screen text-white" style={{
      background: `
        linear-gradient(180deg, #1a2332 0%, #2d3748 50%, #1a202c 100%)
      `
    }}>
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold mb-3">🇯🇲 YaadFlex Super-App</h1>
          <p className="text-gray-300">Your pocket bank, global jobs, rides & social network</p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          
          <Link href="/ride-booking">
            <div className="p-6 border border-gray-600 rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Book Ride</h3>
                  <p className="text-gray-300 text-sm">Professional drivers across Jamaica</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/driver-registration">
            <div className="p-6 border border-gray-600 rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Drive & Earn</h3>
                  <p className="text-gray-300 text-sm">Join our driver network - 85% earnings</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/business-registration">
            <div className="p-6 border border-gray-600 rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-600 flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Business Services</h3>
                  <p className="text-gray-300 text-sm">Register your business on our platform</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/premium-storefront">
            <div className="p-6 border border-gray-600 rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-600 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Marketplace</h3>
                  <p className="text-gray-300 text-sm">Premium storefronts and vendors</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/contactless">
            <div className="p-6 border border-gray-600 rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Delivery</h3>
                  <p className="text-gray-300 text-sm">Fast and reliable delivery services</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/cb-radio">
            <div className="p-6 border border-gray-600 rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
                  <Radio className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Driver Network</h3>
                  <p className="text-gray-300 text-sm">Communication and coordination</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/wallet">
            <div className="p-6 border border-gray-600 rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">💼 YaadFlex Bank</h3>
                  <p className="text-gray-300 text-sm">Send money like email - Your pocket bank</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/global-jobs">
            <div className="p-6 border border-gray-600 rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">🌍 Global Jobs</h3>
                  <p className="text-gray-300 text-sm">Work opportunities in 3/4 of every country</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/social-feed">
            <div className="p-6 border border-gray-600 rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Social Network</h3>
                  <p className="text-gray-300 text-sm">100% independent YaadFlex community</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/real-estate">
            <div className="p-6 border border-gray-600 rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Real Estate</h3>
                  <p className="text-gray-300 text-sm">Property listings and services</p>
                </div>
              </div>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-300 text-sm">
          🌍 Expanding to 3/4 of every country • 💰 Your money as easy as email • 🚗 85% driver earnings
        </div>

      </div>
    </div>
  );
}