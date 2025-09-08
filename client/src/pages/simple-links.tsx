export default function SimpleLinksPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        🇯🇲 YaadFlex Simple Links
      </h1>
      
      <div className="space-y-4 w-full max-w-md">
        
        {/* Simple Direct Links */}
        <a 
          href="/premium-storefront" 
          className="block w-full p-4 bg-gradient-to-r from-gold-500 to-yellow-500 text-black text-center font-bold text-xl rounded hover:from-gold-600 hover:to-yellow-600 transition-colors"
        >
          💎 Premium Business Storefronts
        </a>
        
        <a 
          href="/real-estate" 
          className="block w-full p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white text-center font-bold text-xl rounded hover:from-green-600 hover:to-blue-600 transition-colors"
        >
          🏠 Real Estate Marketplace
        </a>
        
        <a 
          href="/car-marketplace" 
          className="block w-full p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-center font-bold text-xl rounded hover:from-red-600 hover:to-orange-600 transition-colors"
        >
          🚗 Car Marketplace with 3D View
        </a>
        
        <a 
          href="/ride-booking" 
          className="block w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center font-bold text-xl rounded hover:from-purple-600 hover:to-pink-600 transition-colors"
        >
          🚕 Book a Ride
        </a>
        
        <a 
          href="/driver-registration" 
          className="block w-full p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center font-bold text-xl rounded hover:from-emerald-600 hover:to-teal-600 transition-colors"
        >
          💼 Become a Driver - Earn 85%
        </a>
        
        <a 
          href="/business-registration" 
          className="block w-full p-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-center font-bold text-xl rounded hover:from-indigo-600 hover:to-cyan-600 transition-colors"
        >
          🏪 Register Your Business
        </a>
        
      </div>
      
      <p className="text-center text-gray-400 mt-8">
        Click any link above to go directly to that page
      </p>
    </div>
  );
}