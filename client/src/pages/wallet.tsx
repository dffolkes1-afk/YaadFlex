import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Send, Plus, QrCode, TrendingUp, Clock, DollarSign, ArrowUpRight, ArrowDownRight, Key, Gift, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

// API Response Types
interface BetaStatusResponse {
  hasBetaAccess: boolean;
  testMode: boolean;
  message: string;
}

interface DemoWalletResponse {
  balanceYfx: string;
}

interface DemoTransactionResponse {
  id: string;
  type: string;
  amountYfx: string;
  note: string;
  createdAt: string;
}

export default function WalletScreen() {
  const [inviteCode, setInviteCode] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check beta access status
  const { data: betaStatus, isLoading: betaLoading } = useQuery<BetaStatusResponse>({
    queryKey: ['/api/demo/beta-status'],
    retry: false,
  });

  // Get demo wallet
  const { data: wallet, isLoading: walletLoading } = useQuery<DemoWalletResponse>({
    queryKey: ['/api/demo/wallet'],
    enabled: betaStatus?.hasBetaAccess === true,
    retry: false,
  });

  // Get transactions
  const { data: transactions, isLoading: txLoading } = useQuery<DemoTransactionResponse[]>({
    queryKey: ['/api/demo/wallet/transactions'],
    enabled: betaStatus?.hasBetaAccess === true,
    retry: false,
  });

  // Validate invite code
  const inviteMutation = useMutation({
    mutationFn: async (code: string) => {
      return apiRequest("POST", "/api/demo/validate-invite", { inviteCode: code });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Welcome to YaadFlex Beta! 🇯🇲🚀",
        description: `${data.welcomeBonus} added to your demo wallet`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/demo/beta-status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/demo/wallet'] });
      setShowInviteForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Invalid Invite Code",
        description: "Please check your code and try again",
        variant: "destructive",
      });
    },
  });

  // Demo sandbox top-up
  const topupMutation = useMutation({
    mutationFn: async (amount: string) => {
      return apiRequest("POST", "/api/demo/wallet/topup-sandbox", { amount_yfx: amount });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Demo Funds Added! 💰",
        description: `${data.message} (TEST MODE)`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/demo/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/demo/wallet/transactions'] });
      setTopupAmount("");
    },
    onError: () => {
      toast({
        title: "Top-up Failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  // Currency conversion helpers (YFX pegged to Kuwaiti Dinar)
  const convertYfxToUsd = (yfx: string) => {
    return (parseFloat(yfx) * 3.25).toFixed(2); // 1 KWD ≈ $3.25 USD
  };

  const convertYfxToJmd = (yfx: string) => {
    return (parseFloat(yfx) * 500).toFixed(0); // 1 KWD ≈ $500 JMD
  };

  // Loading state
  if (betaLoading || walletLoading) {
    return (
      <div className="p-6 max-w-md mx-auto min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Beta access required
  if (!betaStatus?.hasBetaAccess) {
    return (
      <div className="p-6 max-w-md mx-auto min-h-screen bg-gradient-to-b from-gray-900 to-black text-white space-y-6">
        {/* YaadFlex Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-yellow-400">YaadFlex Wallet</h1>
          <p className="text-green-400">Taking Jamaica to the Moon 🇯🇲🚀</p>
        </div>

        {/* Beta Access Required */}
        <Card className="bg-yellow-900/20 border-yellow-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Key className="w-5 h-5" />
              Beta Access Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              YaadFlex is currently in private beta. Enter your invite code to access the demo wallet.
            </p>
            
            {!showInviteForm ? (
              <Button 
                onClick={() => setShowInviteForm(true)}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
                data-testid="button-enter-invite"
              >
                <Key className="w-4 h-4 mr-2" />
                Enter Invite Code
              </Button>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="invite-code">Invite Code</Label>
                <Input
                  id="invite-code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter your invite code"
                  className="bg-gray-800 border-gray-600"
                  data-testid="input-invite-code"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => inviteMutation.mutate(inviteCode)}
                    disabled={!inviteCode || inviteMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    data-testid="button-validate-invite"
                  >
                    {inviteMutation.isPending ? "Validating..." : "Join Beta"}
                  </Button>
                  <Button
                    onClick={() => setShowInviteForm(false)}
                    variant="outline"
                    className="border-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="text-center text-sm text-gray-400">
          <p>Need an invite code?</p>
          <p>Contact the YaadFlex team</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-6 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* TEST MODE Banner */}
      <Alert className="bg-red-900/20 border-red-600">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-red-200">
          <strong>TEST MODE</strong> - Demo funds only, no real money
        </AlertDescription>
      </Alert>

      {/* YFX Wallet Balance */}
      <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-yellow-900/30 to-black text-white border-yellow-600">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Wallet className="w-8 h-8 text-yellow-400" />
            <Badge variant="secondary" className="bg-yellow-600 text-black">DEMO</Badge>
          </div>
          
          <div>
            <h1 className="text-4xl font-bold text-yellow-400">
              {parseFloat(wallet?.balanceYfx || '0').toFixed(3)} YFX
            </h1>
            <p className="text-lg text-yellow-300 font-semibold">YaadFlex Coin</p>
          </div>

          <div className="space-y-1 text-sm opacity-80">
            <p>≈ ${convertYfxToUsd(wallet?.balanceYfx || '0')} USD</p>
            <p>≈ ${convertYfxToJmd(wallet?.balanceYfx || '0')} JMD</p>
            <p className="text-xs text-gray-400">(Pegged to Kuwaiti Dinar)</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button 
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2" 
              data-testid="button-send-yfx"
            >
              <Send className="w-4 h-4" />
              Send YFX
            </Button>
            <Button 
              variant="outline" 
              className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/50 flex items-center gap-2" 
              data-testid="button-request-yfx"
            >
              <ArrowDownRight className="w-4 h-4" />
              Request
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Top-up */}
      <Card className="bg-blue-900/20 border-blue-600">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Demo Sandbox
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-300">Add fake YFX for testing</p>
          <div className="flex gap-2">
            <Input
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              placeholder="Amount"
              type="number"
              step="0.001"
              className="bg-gray-800 border-gray-600"
              data-testid="input-topup-amount"
            />
            <Button
              onClick={() => topupMutation.mutate(topupAmount)}
              disabled={!topupAmount || topupMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-topup-sandbox"
            >
              {topupMutation.isPending ? "Adding..." : "Add"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setTopupAmount("1.0")}>+1.0</Button>
            <Button size="sm" variant="outline" onClick={() => setTopupAmount("5.0")}>+5.0</Button>
            <Button size="sm" variant="outline" onClick={() => setTopupAmount("10.0")}>+10.0</Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((tx, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">
                      {tx.type === 'welcome_bonus' && '🎁 Welcome Bonus'}
                      {tx.type === 'topup_sandbox' && '💰 Sandbox Top-up'}
                      {tx.type === 'send' && '📤 Sent YFX'}
                      {tx.type === 'receive' && '📥 Received YFX'}
                    </p>
                    <p className="text-sm text-gray-400">{tx.note}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${
                      tx.type === 'send' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {tx.type === 'send' ? '-' : '+'}{parseFloat(tx.amountYfx).toFixed(3)} YFX
                    </span>
                    <p className="text-xs text-gray-400">
                      ≈ ${convertYfxToUsd(tx.amountYfx)} USD
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No transactions yet</p>
          )}
        </CardContent>
      </Card>

      {/* YaadFlex Advantage */}
      <Card className="bg-green-900/20 border-green-600">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-green-400">💡 YaadFlex Advantage</p>
            <p className="text-xs text-gray-300">
              Workers keep <strong>85%</strong> • Platform takes only <strong>15%</strong>
            </p>
            <p className="text-xs text-green-400">
              Best rates in the Caribbean! 🇯🇲
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}