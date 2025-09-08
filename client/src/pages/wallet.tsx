import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wallet, DollarSign, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export default function WalletScreen() {
  return (
    <div className="p-6 max-w-md mx-auto space-y-6 min-h-screen bg-black text-white">
      {/* Wallet Balance - USD Base */}
      <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-green-900 to-black text-white border-green-700">
        <CardContent className="p-6 text-center space-y-4">
          <Wallet className="mx-auto w-12 h-12 text-yellow-400" />
          <h1 className="text-4xl font-bold">$162.00</h1>
          <p className="text-lg text-green-400 font-semibold">USD Balance</p>

          <div className="space-y-2 text-sm opacity-80">
            <p>≈ $25,000 JMD</p>
            <p>≈ $220 CAD</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2" data-testid="button-withdraw">
              <ArrowDownToLine className="w-4 h-4" />
              Cash Out
            </Button>
            <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-900/50 flex items-center gap-2" data-testid="button-add-funds">
              <ArrowUpFromLine className="w-4 h-4" />
              Add Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Transactions */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid grid-cols-2 w-full bg-gray-800 border-green-700">
          <TabsTrigger value="history" className="text-white data-[state=active]:bg-green-700 data-[state=active]:text-white">History</TabsTrigger>
          <TabsTrigger value="settings" className="text-white data-[state=active]:bg-green-700 data-[state=active]:text-white">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card className="mt-4 p-4 bg-gray-900 border-green-700 text-white">
            <h3 className="text-lg font-semibold mb-4 text-green-400">Recent Transactions</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">🚗 Trip Earned</p>
                  <p className="text-sm text-gray-400">Kingston to Spanish Town</p>
                </div>
                <span className="text-green-400 font-bold">+$6.80</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">🔧 Tool Rental</p>
                  <p className="text-sm text-gray-400">Power Drill - 3 days</p>
                </div>
                <span className="text-green-400 font-bold">+$45.00</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">🛍️ Marketplace Sale</p>
                  <p className="text-sm text-gray-400">Bluetooth Speaker</p>
                </div>
                <span className="text-green-400 font-bold">+$85.00</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-red-900/30 rounded-lg">
                <div>
                  <p className="font-medium">⚡ Platform Fee</p>
                  <p className="text-sm text-gray-400">15% commission</p>
                </div>
                <span className="text-red-400 font-bold">-$1.20</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="mt-4 p-4 space-y-4 bg-gray-900 border-green-700 text-white">
            <h2 className="text-lg font-semibold text-green-400">Wallet Settings</h2>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full flex items-center gap-2 border-green-600 text-green-400 hover:bg-green-900/50" data-testid="button-currency-toggle">
                <DollarSign className="w-4 h-4" /> 
                Switch Display Currency
              </Button>
              
              <Button variant="outline" className="w-full flex items-center gap-2 border-green-600 text-green-400 hover:bg-green-900/50" data-testid="button-payment-methods">
                <Wallet className="w-4 h-4" /> 
                Payment Methods
              </Button>

              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-400">💡 YardFlex Advantage</p>
                <p className="text-xs text-gray-400 mt-1">
                  Drivers keep 85% • Platform takes only 15% • Best rates in Jamaica!
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-900/50 p-4 h-auto flex-col gap-2" data-testid="button-earn-more">
          <span className="text-2xl">🚗</span>
          <span className="text-sm">Drive & Earn</span>
        </Button>
        
        <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-900/50 p-4 h-auto flex-col gap-2" data-testid="button-rent-tools">
          <span className="text-2xl">🔧</span>
          <span className="text-sm">Rent Tools</span>
        </Button>
      </div>
    </div>
  );
}