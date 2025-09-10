import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, Paintbrush, Hammer, Trophy, Globe, Heart, Star, 
  Shield, Award, Briefcase, Home, Wrench
} from 'lucide-react';

export default function FounderProfile() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        
        {/* PRIVATE - NOT PUBLIC YET */}
        <div className="bg-slate-900 border border-slate-300 p-6 rounded-lg mb-8 text-center shadow-sm">
          <div className="text-slate-100 font-semibold text-lg mb-2">Confidential Executive Profile</div>
          <div className="text-slate-300 text-sm">Internal document - restricted access for 2-3 years</div>
          <div className="text-slate-400 text-xs italic mt-1">Strategic release pending company maturity</div>
        </div>

        {/* Executive Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
            <div className="bg-white dark:bg-slate-900 rounded-full p-8">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <Building className="h-8 w-8 text-slate-600 dark:text-slate-300" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Chief Executive Officer
          </h1>
          
          <div className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">
            Founder & CEO, YaadFlex Global
          </div>
          
          <div className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            Transforming Caribbean commerce through innovative technology solutions and sustainable business practices
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="px-3 py-1 text-sm border-slate-300 text-slate-700">
              Master Craftsman
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm border-slate-300 text-slate-700">
              Technology Leader
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm border-slate-300 text-slate-700">
              Global Vision
            </Badge>
          </div>
        </div>

        {/* Professional Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Master Craftsman Legacy */}
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                <Hammer className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                Professional Construction Experience
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Elite craftsman with specialized expertise in commercial and residential construction
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
                      • <strong className="text-purple-600">MR. LEE'S HOUSE - TOP OF THE HILL</strong><br/>
                      &nbsp;&nbsp;Worked on it as a young kid in the high-class Norbrook area<br/>
                      • <strong className="text-amber-600">TANKWELL BOSS'S HOUSE - NORBROOK DRIVE (1999-2000)</strong><br/>
                      &nbsp;&nbsp;Good size house next to golf club - Met Eladio & Julian here<br/>
                      • <strong className="text-green-600">SUPER CENTER - SAVED THE PROJECT (2000)</strong><br/>
                      &nbsp;&nbsp;One of few who could frame, board & plaster - complete finisher<br/>
                      • Portmore Commercial Complex - Lead Finisher<br/>
                      • Custom Ceiling Design Innovation - Water Damage Solutions<br/>
                      • Multiple Elite Residences - Norbrook Drive & Terrace<br/>
                      • <strong className="text-red-600">HURRICANE IVAN HERO (2004)</strong> - Church repair work after disaster<br/>
                      • College Principal's House in Cayman - First discovery project<br/>
                      • Charles Russell Jr. Projects - He discovered me after principal & got my permit
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">Cayman Islands Hero Work</div>
                    <div className="text-gray-700">
                      • <strong className="text-purple-600">RARE COMPLETE SKILLSET</strong> - Could frame, board, AND plaster<br/>
                      &nbsp;&nbsp;Most Jamaicans could only do one - I did EVERYTHING<br/>
                      • First discovered by college principal - built their house<br/>
                      • Then discovered by Charles Russell Jr. - took me to complete jobs<br/>
                      • Charles Russell Jr. got me work permit - "I want your permit"<br/>
                      • Freelance work - Skill overcame everything, permit didn't matter<br/>
                      • <strong className="text-red-600">HURRICANE IVAN HERO</strong> - Church repair work after Ivan<br/>
                      &nbsp;&nbsp;Churches approached ME for repairs - worked Sundays, God was with me<br/>
                      • Sunday church work with Alvin Watkins<br/>
                      • Worked at Kmart too - but stayed freelance on both permits<br/>
                      • God blessed me to work like a freelancer - don't know how but HE was there<br/>
                      • Close friend of Junior, Margaret (Mom) & Macross family
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Professional Philosophy</div>
                <div className="text-slate-700 dark:text-slate-300 italic">
                  "Excellence in craftsmanship taught me that true value comes from 
                  dedication, skill, and treating every project as a masterpiece. 
                  This same philosophy now drives YaadFlex."
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tech Leadership */}
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                <Award className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                Technology Leadership
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Strategic transformation from construction expertise to technology innovation
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
                    <div className="font-bold text-lg">The Real Journey & Timeline</div>
                    <div className="text-gray-700">
                      • <strong>Early Years (Grade 1-4):</strong> Phillips family era - Bings, Isa, Debbie<br/>
                      • <strong>Education:</strong> Spanish Town → Swallowfield College → Papine Comprehensive (1997-2000)<br/>
                      • <strong>1994-1995:</strong> Learned drywall from Trevor Bailey<br/>
                      • <strong>1999-2000:</strong> Built Tankwell boss's house - Met Eladio & Julian<br/>
                      • <strong>2000:</strong> First gig with Julian led to saving Super Center<br/>
                      • <strong>2-3 Years in Cayman:</strong> International experience, traveled back and forth<br/>
                      • Grew up without a father - learned to survive alone<br/>
                      • Helped build Mr. Lee's house on top of the hill as a kid<br/>
                      • Hustled in elite areas - from Norbrook Drive to Norbrook Terrace<br/>
                      • Worked for prominent people left, right, and back<br/>
                      • Hated 9-to-5 jobs and gas station work<br/>
                      • Always searching for something different<br/>
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

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Strategic Vision</div>
                <div className="text-slate-700 dark:text-slate-300 italic">
                  "From learning trades to building technology - my journey proves 
                  that with determination, anyone can transform their world. YaadFlex 
                  is my contribution to Jamaica and the global community."
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leadership Philosophy */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 mb-8">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
            <CardTitle className="text-2xl text-center font-semibold text-slate-900 dark:text-slate-100">
              Leadership Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-slate-600 dark:text-slate-400 mb-3">
                  <Wrench className="h-8 w-8 mx-auto" />
                </div>
                <div className="font-semibold text-lg mb-3 text-slate-900 dark:text-slate-100">Excellence</div>
                <div className="text-slate-700 dark:text-slate-300 text-sm">
                  "Every line of code like every wall I finished - 
                  perfect, precise, built to last generations"
                </div>
              </div>

              <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-slate-600 dark:text-slate-400 mb-3">
                  <Heart className="h-8 w-8 mx-auto" />
                </div>
                <div className="font-semibold text-lg mb-3 text-slate-900 dark:text-slate-100">Equity</div>
                <div className="text-slate-700 dark:text-slate-300 text-sm">
                  "85% to the workers because I understand 
                  the value of fair compensation"
                </div>
              </div>

              <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-slate-600 dark:text-slate-400 mb-3">
                  <Globe className="h-8 w-8 mx-auto" />
                </div>
                <div className="font-semibold text-lg mb-3 text-slate-900 dark:text-slate-100">Innovation</div>
                <div className="text-slate-700 dark:text-slate-300 text-sm">
                  "Multi-dimensional leadership approach - 
                  combining traditional craftsmanship with modern technology"
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <div className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Corporate Mission Statement
                </div>
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  "YaadFlex represents a paradigm shift in technology-driven commerce,
                  ensuring equitable compensation for all stakeholders.
                  Our platform leverages innovative solutions to democratize opportunity
                  and create sustainable value for workers, businesses, and communities.<br/><br/>
                  <strong>Multi-faceted leadership enables comprehensive strategic vision.</strong><br/>
                  <strong>This represents a lifelong commitment to transformative impact.</strong>"
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Network */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
            <CardTitle className="text-xl text-center font-semibold text-slate-900 dark:text-slate-100">
              Professional Network & Key Relationships
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-lg">
                <strong className="text-red-600">O'Neill Phillips & Debbie Phillips</strong> - The MAIN Inspirations<br/>
                <span className="italic">"From Norbrook Close - They kept me working, kept me learning, gave me the drive to never stop"</span><br/>
                <strong className="text-blue-600">Bings (Bingi)</strong> - Great childhood friend from the Phillips family<br/>
                <span className="italic">"Drew my attention to the family - we were all that"</span><br/>
                <strong className="text-green-600">I. Phillips (Ice/Isa/Aisha)</strong> - Best friend, Jamaican long-distance runner (early 90s)<br/>
                <span className="italic">"STATHS athlete who ran for Jamaica - stopped running to start working, now overseas"</span><br/>
                <strong>Bubba (Barber) Phillips</strong> - Ice's father, Errol Phillips' brother<br/><br/>
                <strong>Trevor Bailey</strong> - Master Mentor & Teacher (1994-1995 training)<br/>
                <strong>Eladio & Julian</strong> - Connected me to Super Center job (2000)<br/>
                <strong>Dennis Williams</strong> - Prominent Architect & Inspiration<br/>
                <strong>Louis Aitken</strong> - Early Business Mentor<br/>
                <strong>The Bailey Family</strong> - Lifelong Friends & Supporters<br/>
                <strong>Charles Russell Jr. & Macross Family</strong> - Cayman Islands family<br/>
                <strong>Alvin Watkins</strong> - Sunday church work partner<br/>
                <strong>Wesley</strong> - First friend in Cayman, helped get work permit<br/>
                <strong>Junior & Margaret (Mom)</strong> - Close Macross family friends<br/>
                <strong>Randy & Cousin Trina</strong> - Good friends from Raccoon area<br/>
                <strong>Super Dave & Andy</strong> - Hung out at Raccoon together<br/>
                <strong>Ms. Lynn</strong> - Official woman from Raccoon, always sea fishing<br/>
                <strong>Thomas</strong> - Junior's brother (Charles Jr.), lives by Prospect<br/>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="font-medium text-slate-900 dark:text-slate-100 text-center">
                  "Gratitude to mentors, colleagues, and supporters who contributed to this journey.<br/>
                  YaadFlex represents a collective vision for sustainable economic development.<br/>
                  From local communities to global markets - building bridges for shared prosperity."
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}