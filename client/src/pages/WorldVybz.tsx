import { ExternalLink, Play, MessageCircle, Globe, Eye } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'youtube' | 'telegram' | 'google';
  url: string;
  thumbnail?: string;
  country: string;
  category: string;
  views?: string;
}

const globalContent: ContentItem[] = [
  // African Content
  {
    id: '1',
    title: 'Lagos Street Food Culture - Amazing Jollof Rice',
    description: 'See how authentic Jollof rice is made on Lagos streets - the real African way',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=lagos+street+food+jollof+rice',
    country: 'Nigeria 🇳🇬',
    category: 'Culture & Food',
    views: '2.3M views'
  },
  {
    id: '2',
    title: 'Accra Gold Mines - Real Mining Operations',
    description: 'Live footage from Ghana gold mining operations - see the real work happening',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=ghana+gold+mining+operations',
    country: 'Ghana 🇬🇭',
    category: 'Business & Mining',
    views: '890K views'
  },
  {
    id: '3',
    title: 'Cape Town Township Life - Real Stories',
    description: 'Daily life in South African townships - real people, real stories',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=cape+town+township+daily+life',
    country: 'South Africa 🇿🇦',
    category: 'Lifestyle',
    views: '1.5M views'
  },
  {
    id: '4',
    title: 'Nairobi Matatu Culture - Urban Transport',
    description: 'The famous Matatu buses of Kenya - colorful urban transport culture',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=nairobi+matatu+culture',
    country: 'Kenya 🇰🇪',
    category: 'Transport & Culture',
    views: '670K views'
  },
  {
    id: '5',
    title: 'African Fashion Designers - Ankara Styles',
    description: 'Beautiful African fashion and Ankara clothing designs from across the continent',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=african+ankara+fashion+designs',
    country: 'Pan-Africa 🌍',
    category: 'Fashion & Style',
    views: '3.2M views'
  },

  // Caribbean Content
  {
    id: '6',
    title: 'Jamaica Blue Mountain Coffee Farms',
    description: 'How the world\'s most expensive coffee is grown in Jamaica\'s mountains',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=jamaica+blue+mountain+coffee+farms',
    country: 'Jamaica 🇯🇲',
    category: 'Agriculture & Export',
    views: '450K views'
  },
  {
    id: '7',
    title: 'Trinidad Carnival Preparation',
    description: 'Behind the scenes of Trinidad Carnival - the world\'s greatest street party',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=trinidad+carnival+preparation+behind+scenes',
    country: 'Trinidad 🇹🇹',
    category: 'Culture & Festivals',
    views: '820K views'
  },

  // Global Interesting Content
  {
    id: '8',
    title: 'Mumbai Street Vendors - Business Hustle',
    description: 'How street vendors in Mumbai make their living - amazing business skills',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=mumbai+street+vendors+business',
    country: 'India 🇮🇳',
    category: 'Business & Entrepreneurship',
    views: '1.8M views'
  },
  {
    id: '9',
    title: 'Philippines Island Life - Remote Communities',
    description: 'Life on remote Philippine islands - fishing communities and island culture',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=philippines+remote+island+communities',
    country: 'Philippines 🇵🇭',
    category: 'Island Life',
    views: '920K views'
  },
  {
    id: '10',
    title: 'Morocco Marrakech Markets - Trading Culture',
    description: 'The famous souks of Marrakech - traditional trading and craftsmanship',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=marrakech+souk+markets+trading',
    country: 'Morocco 🇲🇦',
    category: 'Markets & Trade',
    views: '1.1M views'
  }
];

export default function WorldVybz() {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-500 mb-4 flex items-center justify-center gap-3">
            <Globe className="h-10 w-10" />
            World Vybz
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real content from around the world - Africa, Caribbean, Asia, and beyond. 
            See what's naturally happening in different cultures and countries.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['Culture & Food', 'Business & Mining', 'Transport & Culture', 'Fashion & Style', 'Island Life', 'Markets & Trade'].map((category) => (
            <span 
              key={category}
              className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700 cursor-pointer transition-colors"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {globalContent.map((item) => (
            <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
              {/* Thumbnail/Icon */}
              <div className="h-48 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                {item.type === 'youtube' && <Play className="h-16 w-16 text-white opacity-80" />}
                {item.type === 'telegram' && <MessageCircle className="h-16 w-16 text-white opacity-80" />}
                {item.type === 'google' && <Globe className="h-16 w-16 text-white opacity-80" />}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-green-600 px-2 py-1 rounded text-white">
                    {item.country}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.views}
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-2 text-white">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm mb-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                    {item.category}
                  </span>

                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                    data-testid={`link-content-${item.id}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Watch Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-8 bg-gray-900 rounded-lg">
          <h3 className="text-xl font-bold text-green-500 mb-4">Discover More</h3>
          <p className="text-gray-400 mb-4">
            This is just the beginning! We're constantly adding more interesting content from around the world.
            From African business success stories to Caribbean culture, Asian innovations to global entrepreneurship.
          </p>
          <p className="text-sm text-gray-500">
            All links open safely in new windows to YouTube, Google, and other trusted platforms.
            Explore cultures, learn about different countries, and see what's happening naturally around the world.
          </p>
        </div>
      </div>
    </div>
  );
}