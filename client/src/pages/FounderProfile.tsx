import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, Paintbrush, Hammer, Trophy, Globe, Heart, Star, 
  Shield, Award, Briefcase, Home, Wrench
} from 'lucide-react';

export default function FounderProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-white to-emerald-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* PRIVATE - NOT PUBLIC YET */}
        <div className="bg-black border-4 border-red-600 p-6 rounded-lg mb-6 text-center shadow-2xl">
          <div className="text-red-500 font-bold text-2xl mb-2">🔒 TOP SECRET - HIDDEN IN THE DARK 🔒</div>
          <div className="text-red-400 text-lg">This profile stays hidden for 2-3 YEARS</div>
          <div className="text-amber-400 italic">When the company is BOLDER - then the world will know</div>
        </div>

        {/* Executive Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-1 bg-gradient-to-r from-gold-400 to-emerald-400 rounded-full mb-4">
            <div className="bg-white rounded-full p-6">
              <div className="text-6xl">👑</div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gold-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent mb-2">
            THE VISIONARY
          </h1>
          
          <div className="text-2xl font-semibold text-gray-800 mb-4">
            Founder & CEO of YaadFlex Global
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Badge className="px-4 py-2 text-lg bg-gold-100 text-gold-800">
              🏗️ Master Craftsman
            </Badge>
            <Badge className="px-4 py-2 text-lg bg-emerald-100 text-emerald-800">
              💡 Tech Innovator
            </Badge>
            <Badge className="px-4 py-2 text-lg bg-blue-100 text-blue-800">
              🌍 Global Visionary
            </Badge>
          </div>
        </div>

        {/* Professional Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Master Craftsman Legacy */}
          <Card className="border-2 border-gold-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-gold-50 to-amber-50">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Hammer className="h-8 w-8 text-gold-600" />
                Master Drywall Specialist & Finisher
              </CardTitle>
              <CardDescription className="text-lg">
                Elite Craftsman | Interior Design Expert | Texture Specialist
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Trophy className="h-6 w-6 text-gold-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">Trained by Legends</div>
                    <div className="text-gray-700">
                      • Mentored by Master Trevor Bailey<br/>
                      • Recognized by Dennis Williams - Prominent Architect<br/>
                      • Certified Drywall Finisher & Plastering Expert
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Paintbrush className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">Specialized Expertise</div>
                    <div className="text-gray-700">
                      • Sand Finish & Orange Peel Textures<br/>
                      • Spray Textures & Custom Patterns<br/>
                      • Interior Decoration & Design<br/>
                      • Architectural Ceiling Solutions
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">Notable Projects</div>
                    <div className="text-gray-700">
                      • Portmore Commercial Complex - Lead Finisher<br/>
                      • Custom Ceiling Design Innovation - Water Damage Solutions<br/>
                      • Multiple High-End Residential Projects<br/>
                      • International Projects in Grand Cayman
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">International Experience</div>
                    <div className="text-gray-700">
                      • Cayman Islands - Macross/Russell Company<br/>
                      • Premium Construction Projects<br/>
                      • Cross-Cultural Business Expertise
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-gold-50 to-amber-50 rounded-lg border-2 border-gold-300">
                <div className="font-bold text-gold-800 mb-2">🏆 Professional Philosophy:</div>
                <div className="text-gold-700 italic">
                  "Excellence in craftsmanship taught me that true value comes from 
                  dedication, skill, and treating every project as a masterpiece. 
                  This same philosophy now drives YaadFlex."
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tech Visionary */}
          <Card className="border-2 border-emerald-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Award className="h-8 w-8 text-emerald-600" />
                Revolutionary Tech Leader
              </CardTitle>
              <CardDescription className="text-lg">
                From Craftsman to Tech CEO | Building Jamaica's Future
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Star className="h-6 w-6 text-emerald-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">YaadFlex Vision</div>
                    <div className="text-gray-700">
                      • Created Jamaica's First Total Economy Super-App<br/>
                      • 85% Earnings Model - Revolutionary Fair Pay<br/>
                      • Voice-First Technology for All People<br/>
                      • 100% User Ownership Philosophy
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">Overcoming Adversity</div>
                    <div className="text-gray-700">
                      • Lost home twice - rebuilt stronger each time<br/>
                      • Tools stolen - never stopped working<br/>
                      • Fletcher's Land fire survivor - February 26th<br/>
                      • From Love Lane to Mark Lane - always moving forward
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Heart className="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">The Real Journey</div>
                    <div className="text-gray-700">
                      • Grew up without a father - learned to survive alone<br/>
                      • Hated 9-to-5 jobs and gas station work<br/>
                      • Always searching for something different<br/>
                      • Grasped knowledge everywhere - streets to books<br/>
                      • From the lower side but refused to stay there<br/>
                      • Son of Tina Bennett, grandson of Hera Buchanan<br/>
                      • "Out of Many, One People" - living proof
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Star className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">Childhood Competition Spirit</div>
                    <div className="text-gray-700">
                      • Loved Coca-Cola vs Pepsi battles as a kid<br/>
                      • Sprite competitions, Cool Cat contests<br/>
                      • Learned about competition and winning<br/>
                      • Saw the bad in the world, chose to build peace<br/>
                      • Always making things work with fun
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">Business Innovation</div>
                    <div className="text-gray-700">
                      • Self-taught technology and business<br/>
                      • Created platform where everyone benefits<br/>
                      • Teaching others to earn and grow<br/>
                      • Building generational wealth for Jamaica
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-300">
                <div className="font-bold text-emerald-800 mb-2">💚 Life Mission:</div>
                <div className="text-emerald-700 italic">
                  "From learning trades to building technology - my journey proves 
                  that with determination, anyone can transform their world. YaadFlex 
                  is my gift to Jamaica and the world."
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leadership Philosophy */}
        <Card className="border-2 border-purple-300 shadow-xl mb-8">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="text-3xl text-center">
              🌟 Leadership Philosophy & Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="text-center p-4 bg-gradient-to-br from-gold-50 to-amber-50 rounded-lg">
                <div className="text-4xl mb-3">🛠️</div>
                <div className="font-bold text-xl mb-2">CRAFTSMANSHIP</div>
                <div className="text-gray-700">
                  "Every line of code like every wall I finished - 
                  perfect, precise, built to last generations"
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg">
                <div className="text-4xl mb-3">🤝</div>
                <div className="font-bold text-xl mb-2">FAIRNESS</div>
                <div className="text-gray-700">
                  "85% to the workers because I know what it's like 
                  to work hard and barely survive"
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <div className="text-4xl mb-3">🚀</div>
                <div className="font-bold text-xl mb-2">INNOVATION</div>
                <div className="text-gray-700">
                  "From Sprite competitions as a kid to building super-apps - 
                  always competing, always creating something new"
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border-2 border-purple-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-800 mb-3">
                  🌍 THE YAADFLEX PROMISE
                </div>
                <div className="text-xl text-purple-700">
                  "I built YaadFlex not just as an app, but as a movement.<br/>
                  A movement where hard-working people finally get their fair share.<br/>
                  Where technology serves humanity, not the other way around.<br/>
                  Where every driver, every broker, every worker becomes an owner.<br/><br/>
                  <strong>This is my life's work - from Fletcher's Land to the world.</strong>"
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Network */}
        <Card className="border-2 border-amber-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-gold-50">
            <CardTitle className="text-2xl text-center">
              🏆 Professional Network & Acknowledgments
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-lg">
                <strong className="text-red-600">O'Neill Phillips & Debbie Phillips</strong> - The MAIN Inspirations<br/>
                <span className="italic">"They kept me working, kept me learning, gave me the drive to never stop"</span><br/><br/>
                <strong>Trevor Bailey</strong> - Master Mentor & Teacher<br/>
                <strong>Dennis Williams</strong> - Prominent Architect & Inspiration<br/>
                <strong>Louis Aitken</strong> - Early Business Mentor<br/>
                <strong>The Bailey Family</strong> - Lifelong Friends & Supporters<br/>
                <strong>Macross/Russell Company</strong> - International Experience<br/>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-gold-50 to-yellow-50 rounded-lg">
                <div className="font-bold text-amber-800">
                  "To everyone who believed in me when I had nothing but skills and dreams - 
                  YaadFlex is our victory."
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}