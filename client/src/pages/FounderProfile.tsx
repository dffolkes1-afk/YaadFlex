import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, Paintbrush, Hammer, Trophy, Globe, Heart, Star, 
  Shield, Award, Briefcase, Home, Wrench
} from 'lucide-react';
import { COMPANY_INFO } from '@shared/company';

export default function FounderProfile() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        
        {/* BLACKROCK CORPORATE PROFILE */}
        <div className="bg-slate-900 border border-slate-300 p-6 rounded-lg mb-8 text-center shadow-sm">
          <div className="text-slate-100 font-semibold text-lg mb-2">{COMPANY_INFO.PARENT_COMPANY} Corporate Executive Profile</div>
          <div className="text-slate-300 text-sm">{COMPANY_INFO.COMPANY_NAME} - {COMPANY_INFO.PORTFOLIO_DESIGNATION}</div>
          <div className="text-slate-400 text-xs italic mt-1">{COMPANY_INFO.DESCRIPTION.mission}</div>
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
            {COMPANY_INFO.COMPANY_NAME} - {COMPANY_INFO.PORTFOLIO_DESIGNATION}
          </div>
          
          <div className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            {COMPANY_INFO.DESCRIPTION.medium}
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="px-3 py-1 text-sm border-slate-300 text-slate-700">
              {COMPANY_INFO.CEO.company_designation}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm border-slate-300 text-slate-700">
              Global Technology Leader
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm border-slate-300 text-slate-700">
              Enterprise Vision
            </Badge>
          </div>
        </div>

        {/* Professional Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* BlackRock Corporate Leadership */}
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                <Building className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                {COMPANY_INFO.PARENT_COMPANY} Corporate Leadership
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Executive leadership representing BlackRock's global investment and technology portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Trophy className="h-6 w-6 text-gold-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">BlackRock Global Platform</div>
                    <div className="text-gray-700">
                      • $10 Trillion Assets Under Management<br/>
                      • Global Financial Infrastructure Leadership<br/>
                      • Strategic Technology Investment Portfolio<br/>
                      • Corporate Governance Excellence
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Paintbrush className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">Corporate Expertise</div>
                    <div className="text-gray-700">
                      • Enterprise Technology Solutions<br/>
                      • Global Market Penetration Strategies<br/>
                      • Financial Infrastructure Development<br/>
                      • Caribbean Market Leadership
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">BlackRock Strategic Initiatives</div>
                    <div className="text-gray-700">
                      • <strong className="text-purple-600">YAADFLEX GLOBAL PLATFORM LAUNCH</strong><br/>
                      &nbsp;&nbsp;Caribbean's first BlackRock-backed super-app ecosystem<br/>
                      • <strong className="text-amber-600">DIGITAL FINANCIAL INFRASTRUCTURE</strong><br/>
                      &nbsp;&nbsp;Enterprise-grade payment and banking solutions<br/>
                      • <strong className="text-green-600">REGIONAL MARKET EXPANSION</strong><br/>
                      &nbsp;&nbsp;Strategic rollout across Caribbean and Latin American markets<br/>
                      • Global Technology Integration - AI & Machine Learning<br/>
                      • Corporate Governance Implementation<br/>
                      • Regulatory Compliance Framework<br/>
                      • <strong className="text-red-600">ESG LEADERSHIP INITIATIVES</strong> - Sustainable development goals<br/>
                      • Strategic Partnership Development<br/>
                      • Risk Management & Corporate Controls
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">Global Market Leadership</div>
                    <div className="text-gray-700">
                      • <strong className="text-purple-600">COMPREHENSIVE EXECUTIVE PLATFORM</strong> - Integrated business solutions<br/>
                      &nbsp;&nbsp;End-to-end ecosystem covering payments, delivery, and business services<br/>
                      • Strategic Market Entry - Caribbean Financial Hub<br/>
                      • Regulatory Compliance - Multi-jurisdiction framework<br/>
                      • International Partnership Development<br/>
                      • <strong className="text-red-600">CRISIS MANAGEMENT EXCELLENCE</strong> - Pandemic response leadership<br/>
                      &nbsp;&nbsp;Maintained operations during global disruption with innovative solutions<br/>
                      • Corporate Social Responsibility Initiatives<br/>
                      • Multi-currency Platform Development<br/>
                      • Cross-border Payment Solutions<br/>
                      • Strategic Technology Partnerships<br/>
                      • BlackRock Global Network Integration
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Corporate Philosophy</div>
                <div className="text-slate-700 dark:text-slate-300 italic">
                  "BlackRock's commitment to excellence and fiduciary responsibility guides 
                  our approach to Caribbean market development. YaadFlex represents our 
                  strategic investment in regional digital transformation and financial inclusion."
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tech Leadership */}
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                <Award className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                BlackRock Technology Leadership
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Leveraging BlackRock's global technology infrastructure for Caribbean market innovation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Star className="h-6 w-6 text-emerald-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">BlackRock Caribbean Vision</div>
                    <div className="text-gray-700">
                      • BlackRock-Backed Total Economy Platform<br/>
                      • Enterprise-Grade Financial Infrastructure<br/>
                      • AI-Powered Technology Stack<br/>
                      • Corporate Governance & Risk Management
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">Market Resilience</div>
                    <div className="text-gray-700">
                      • Pandemic-Proof Business Continuity<br/>
                      • Multi-Currency Stability Framework<br/>
                      • Regional Market Diversification<br/>
                      • BlackRock Risk Management Excellence
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Heart className="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">Corporate Development Timeline</div>
                    <div className="text-gray-700">
                      • <strong>Strategic Planning Phase:</strong> Market analysis and opportunity assessment<br/>
                      • <strong>Investment Framework:</strong> BlackRock Due Diligence & Portfolio Integration<br/>
                      • <strong>Platform Development:</strong> Enterprise-grade technology infrastructure<br/>
                      • <strong>Regulatory Compliance:</strong> Multi-jurisdiction legal framework<br/>
                      • <strong>Market Entry:</strong> Caribbean hub expansion strategy<br/>
                      • <strong>Partnership Development:</strong> Strategic alliances with regional leaders<br/>
                      • Corporate governance implementation<br/>
                      • Risk management framework establishment<br/>
                      • ESG compliance and sustainability initiatives<br/>
                      • Technology integration with BlackRock global systems<br/>
                      • Regional market expansion planning<br/>
                      • Financial inclusion program development<br/>
                      • "Global Vision, Regional Impact" - corporate mission
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Star className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">Competitive Market Strategy</div>
                    <div className="text-gray-700">
                      • Global market positioning leadership<br/>
                      • Strategic competitive advantage development<br/>
                      • Market share acquisition strategies<br/>
                      • Innovation-driven growth approach<br/>
                      • Sustainable business model optimization
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <div className="font-bold text-lg">Corporate Innovation</div>
                    <div className="text-gray-700">
                      • BlackRock technology and financial expertise<br/>
                      • Enterprise platform ecosystem development<br/>
                      • Professional development and training programs<br/>
                      • Regional economic development initiatives
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">BlackRock Strategic Vision</div>
                <div className="text-slate-700 dark:text-slate-300 italic">
                  "Leveraging BlackRock's global financial expertise and technology infrastructure 
                  to drive digital transformation across the Caribbean region. YaadFlex represents 
                  our commitment to sustainable economic development and financial inclusion."
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
                  "Every platform feature reflects BlackRock's commitment to excellence - 
                  enterprise-grade, secure, built for global scale"
                </div>
              </div>

              <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-slate-600 dark:text-slate-400 mb-3">
                  <Heart className="h-8 w-8 mx-auto" />
                </div>
                <div className="font-semibold text-lg mb-3 text-slate-900 dark:text-slate-100">Equity</div>
                <div className="text-slate-700 dark:text-slate-300 text-sm">
                  "Fair value distribution backed by BlackRock's 
                  commitment to sustainable business practices"
                </div>
              </div>

              <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-slate-600 dark:text-slate-400 mb-3">
                  <Globe className="h-8 w-8 mx-auto" />
                </div>
                <div className="font-semibold text-lg mb-3 text-slate-900 dark:text-slate-100">Innovation</div>
                <div className="text-slate-700 dark:text-slate-300 text-sm">
                  "Global financial leadership approach - 
                  combining BlackRock's institutional expertise with regional innovation"
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <div className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Corporate Mission Statement
                </div>
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  "YaadFlex represents BlackRock's strategic investment in Caribbean digital transformation,
                  leveraging our global financial infrastructure to create sustainable economic value.
                  Our platform combines enterprise-grade technology with regional expertise
                  to drive financial inclusion and economic development.<br/><br/>
                  <strong>BlackRock's institutional leadership enables comprehensive market solutions.</strong><br/>
                  <strong>This represents our commitment to long-term regional development.</strong>"
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Network */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
            <CardTitle className="text-xl text-center font-semibold text-slate-900 dark:text-slate-100">
              BlackRock Corporate Network & Strategic Partnerships
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-lg">
                <strong className="text-red-600">BlackRock Executive Leadership</strong> - Global Financial Management<br/>
                <span className="italic">"Strategic oversight and governance of YaadFlex operations across Caribbean markets"</span><br/>
                <strong className="text-blue-600">BlackRock Technology Division</strong> - Enterprise Infrastructure<br/>
                <span className="italic">"Advanced AI and machine learning capabilities integrated into platform"</span><br/>
                <strong className="text-green-600">Regional Partnership Directors</strong> - Caribbean Market Strategy<br/>
                <span className="italic">"Local expertise combined with global financial infrastructure"</span><br/>
                <strong>BlackRock Risk Management</strong> - Corporate Governance & Compliance<br/><br/>
                <strong>Financial Services Partnerships</strong> - Banking & Payment Infrastructure<br/>
                <strong>Technology Partners</strong> - AI & Cloud Computing Solutions<br/>
                <strong>Regulatory Affairs</strong> - Multi-Jurisdiction Compliance<br/>
                <strong>Corporate Development</strong> - Strategic Investments & Growth<br/>
                <strong>BlackRock Sustainable Investing</strong> - ESG Leadership<br/>
                <strong>Regional Government Relations</strong> - Policy & Economic Development<br/>
                <strong>Academic Partnerships</strong> - Research & Development Initiatives<br/>
                <strong>Industry Advisory Board</strong> - Technology & Financial Services<br/>
                <strong>Community Development Partners</strong> - Social Impact Programs<br/>
                <strong>BlackRock Client Solutions</strong> - Corporate & Institutional Services<br/>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="font-medium text-slate-900 dark:text-slate-100 text-center">
                  "BlackRock's commitment to stakeholder capitalism and sustainable development.<br/>
                  YaadFlex represents institutional investment in Caribbean economic transformation.<br/>
                  From regional innovation to global financial infrastructure - creating lasting value."
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}