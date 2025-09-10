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
  // Island Life - Free & Stress-Free Living
  {
    id: '1',
    title: 'Caribbean Island Life - Living Free & Happy',
    description: 'See how Caribbean islanders live stress-free, enjoying life without financial pressure',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=caribbean+island+life+stress+free+living',
    country: 'Caribbean 🏝️',
    category: 'Island Life',
    views: '3.2M views'
  },
  {
    id: '2',
    title: 'Philippines Island Communities - Simple Living',
    description: 'Remote island communities living simply, fishing, sharing, and enjoying life naturally',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=philippines+island+communities+simple+living',
    country: 'Philippines 🇵🇭',
    category: 'Island Life',
    views: '2.8M views'
  },
  {
    id: '3',
    title: 'Fiji Village Life - Community Living Without Stress',
    description: 'Fiji villages where money doesn\'t control life - community sharing and happiness',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=fiji+village+life+community+living',
    country: 'Fiji 🇫🇯',
    category: 'Island Life',
    views: '1.9M views'
  },

  // River Life - Free Spirit Communities
  {
    id: '4',
    title: 'Amazon River Communities - Living With Nature',
    description: 'Communities living along Amazon rivers - free from city stress, connected to nature',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=amazon+river+communities+living+with+nature',
    country: 'Brazil 🇧🇷',
    category: 'River Life',
    views: '2.1M views'
  },
  {
    id: '5',
    title: 'African River Life - Peaceful Communities',
    description: 'African river communities living peacefully without the stress of modern financial pressure',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=african+river+communities+peaceful+living',
    country: 'Africa 🌍',
    category: 'River Life',
    views: '1.7M views'
  },
  {
    id: '6',
    title: 'Mekong River Life - Floating Communities',
    description: 'Floating communities on Mekong River living free, sharing resources, enjoying simple life',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=mekong+river+floating+communities+simple+life',
    country: 'Vietnam 🇻🇳',
    category: 'River Life',
    views: '1.4M views'
  },

  // Mountain Free Life
  {
    id: '7',
    title: 'Himalayan Mountain Communities - Simple Living',
    description: 'Mountain communities living without financial stress - sharing, helping, enjoying life',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=himalayan+mountain+communities+simple+living',
    country: 'Nepal 🇳🇵',
    category: 'Mountain Life',
    views: '2.3M views'
  },
  {
    id: '8',
    title: 'Andean Communities - Living Free in Mountains',
    description: 'Andean mountain people living free from money stress, sharing resources naturally',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=andean+communities+living+free+mountains',
    country: 'Peru 🇵🇪',
    category: 'Mountain Life',
    views: '1.8M views'
  },

  // African Free Spirit Communities
  {
    id: '9',
    title: 'African Village Life - Community Sharing',
    description: 'African villages where community comes first - sharing resources, no financial stress',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=african+village+life+community+sharing',
    country: 'Africa 🌍',
    category: 'Village Life',
    views: '3.5M views'
  },
  {
    id: '10',
    title: 'Masai Community Life - Living Free & Traditional',
    description: 'Masai communities living free from modern financial pressure - traditional sharing economy',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=masai+community+life+traditional+sharing',
    country: 'Kenya 🇰🇪',
    category: 'Village Life',
    views: '2.6M views'
  },

  // Beach & Coastal Free Life
  {
    id: '11',
    title: 'Pacific Island Beach Life - No Money Stress',
    description: 'Pacific islanders living on beaches, fishing, sharing - money doesn\'t control happiness',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=pacific+island+beach+life+no+money+stress',
    country: 'Pacific Islands 🏖️',
    category: 'Beach Life',
    views: '4.1M views'
  },
  {
    id: '12',
    title: 'Costa Rica Beach Communities - Simple Living',
    description: 'Costa Rican beach communities living simply, surfing, fishing, enjoying life freely',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=costa+rica+beach+communities+simple+living',
    country: 'Costa Rica 🇨🇷',
    category: 'Beach Life',
    views: '2.9M views'
  },

  // Caribbean Free Spirit Life
  {
    id: '13',
    title: 'Jamaica Country Life - Free & Easy Living',
    description: 'Rural Jamaica where life is free and easy - growing food, sharing, no financial stress',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=jamaica+country+life+free+easy+living',
    country: 'Jamaica 🇯🇲',
    category: 'Country Life',
    views: '2.4M views'
  },
  {
    id: '14',
    title: 'Barbados Village Life - Community Spirit',
    description: 'Barbadian villages where community spirit means no one goes without - sharing economy',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=barbados+village+life+community+spirit',
    country: 'Barbados 🇧🇧',
    category: 'Village Life',
    views: '1.6M views'
  },

  // Off-Grid Free Living
  {
    id: '15',
    title: 'Off-Grid Communities - Living Without Money Stress',
    description: 'Communities living off-grid, growing food, sharing resources - free from financial pressure',
    type: 'youtube',
    url: 'https://www.youtube.com/results?search_query=off+grid+communities+living+without+money+stress',
    country: 'Global 🌍',
    category: 'Off-Grid Life',
    views: '5.7M views'
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
            World Vybz - Free Spirit Life
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how people around the world live FREE and stress-free! River life, island life, communities that enjoy life without financial pressure. 
            This is the FREE SPIRIT LIFE we're building with YaadFlex - where money doesn't control your happiness!
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['Island Life', 'River Life', 'Mountain Life', 'Village Life', 'Beach Life', 'Country Life', 'Off-Grid Life'].map((category) => (
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
          <h3 className="text-xl font-bold text-green-500 mb-4">This Is The FREE SPIRIT LIFE We're Building</h3>
          <p className="text-gray-400 mb-4">
            See how people around the world live FREE from financial stress! Island communities, river life, mountain villages - 
            places where money doesn't control your happiness. This is what YaadFlex represents - limiting how your pocket 
            stresses you and hurts your life every day. We're building a platform where people can live freely and enjoy life!
          </p>
          <p className="text-sm text-gray-500">
            With YaadFlex's 85% driver earnings and fair financial system, we're creating the FREE SPIRIT LIFE right here. 
            No more financial pressure controlling your happiness - just pure living, community sharing, and enjoying life naturally.
          </p>
        </div>
      </div>
    </div>
  );
}