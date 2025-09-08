import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Building2,
  CreditCard, 
  DollarSign,
  Plus,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Shield,
  Clock,
  Calculator,
  PiggyBank,
  Wallet,
  Globe,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';

type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings' | 'business';
  accountHolderName: string;
  isVerified: boolean;
  isPrimary: boolean;
  balance?: number;
  lastUpdated: string;
  currency: 'JMD' | 'USD';
};

type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  currency: 'JMD' | 'USD';
  description: string;
  source: string;
  destination?: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  category: 'ride_earnings' | 'property_commission' | 'vehicle_sale' | 'business_revenue' | 'transfer';
};

type YaadFlexAccount = {
  id: string;
  accountNumber: string;
  balance: {
    jmd: number;
    usd: number;
  };
  totalEarnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    allTime: number;
  };
  autoTransferEnabled: boolean;
  transferThreshold: number;
  primaryBankAccountId?: string;
};

export default function YaadFlexBankingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedBankCountry, setSelectedBankCountry] = useState('Jamaica');
  const [showAccountNumbers, setShowAccountNumbers] = useState(false);
  const [newBankAccount, setNewBankAccount] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking',
    accountHolderName: '',
    currency: 'JMD'
  });

  // Fetch user's bank accounts
  const { data: bankAccounts = [], isLoading: accountsLoading } = useQuery<BankAccount[]>({
    queryKey: ['/api/banking/accounts'],
    retry: false,
  });

  // Fetch YaadFlex business account
  const { data: yaadflexAccount, isLoading: yaadflexLoading } = useQuery<YaadFlexAccount>({
    queryKey: ['/api/banking/yaadflex-account'],
    retry: false,
  });

  // Fetch recent transactions  
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/banking/transactions'],
    retry: false,
  });

  // Add bank account mutation
  const addBankAccountMutation = useMutation({
    mutationFn: async (accountData: any) => {
      const response = await apiRequest('POST', '/api/banking/accounts', accountData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "✅ Bank Account Added!",
        description: `${data.bankName} account connected successfully. Verification will take 1-2 business days.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/banking/accounts'] });
      setNewBankAccount({
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'checking',
        accountHolderName: '',
        currency: 'JMD'
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Bank Account",
        description: error.message || "Unable to connect bank account.",
        variant: "destructive",
      });
    },
  });

  // Create YaadFlex account mutation
  const createYaadFlexAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/banking/create-yaadflex-account');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "🎉 YaadFlex Business Account Created!",
        description: `Your business account ${data.accountNumber} is ready for automatic payments!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/banking/yaadflex-account'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Account",
        description: error.message || "Unable to create YaadFlex account.",
        variant: "destructive",
      });
    },
  });

  // Set primary account mutation
  const setPrimaryAccountMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const response = await apiRequest('POST', `/api/banking/accounts/${accountId}/set-primary`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "✅ Primary Account Updated",
        description: "This account will now receive your automatic transfers.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/banking/accounts'] });
    },
  });

  const handleAddBankAccount = () => {
    if (!newBankAccount.bankName || !newBankAccount.accountNumber || !newBankAccount.accountHolderName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    addBankAccountMutation.mutate({
      ...newBankAccount,
      country: selectedBankCountry
    });
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return '';
    if (showAccountNumbers) return accountNumber;
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownRight className="h-4 w-4 text-green-600" />;
      case 'withdrawal': return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      default: return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-green-600';
      case 'withdrawal': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Jamaican banks
  const jamaicanBanks = [
    'NCB (National Commercial Bank)',
    'Scotiabank Jamaica',
    'JN Bank',
    'CIBC FirstCaribbean',
    'Sagicor Bank',
    'VM Bank',
    'Development Bank of Jamaica',
    'Bank of Nova Scotia',
    'Mayberry Investments',
    'PanCaribbean Bank'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
            🏦 YaadFlex Banking System
          </h1>
          <p className="text-2xl text-muted-foreground mb-6">
            Manage Your Bank Accounts & Automatic Payments - Everything in One Place
          </p>
          <div className="flex justify-center gap-2 flex-wrap mb-8">
            <Badge variant="secondary" className="text-green-600 text-lg px-4 py-2">💰 Automatic Transfers</Badge>
            <Badge variant="secondary" className="text-blue-600 text-lg px-4 py-2">🔒 Bank Grade Security</Badge>
            <Badge variant="secondary" className="text-purple-600 text-lg px-4 py-2">🌍 Multi-Currency Support</Badge>
            <Badge variant="secondary" className="text-orange-600 text-lg px-4 py-2">📊 Real-Time Tracking</Badge>
          </div>
        </div>

        <Tabs defaultValue="yaadflex-account" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="yaadflex-account" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              YaadFlex Account
            </TabsTrigger>
            <TabsTrigger value="bank-accounts" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Bank Accounts
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="add-account" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Bank Account
            </TabsTrigger>
          </TabsList>

          {/* YaadFlex Business Account */}
          <TabsContent value="yaadflex-account" className="space-y-6">
            
            {yaadflexAccount ? (
              <>
                {/* Account Overview */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PiggyBank className="h-5 w-5 text-green-600" />
                      YaadFlex Business Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {formatCurrency(yaadflexAccount.balance.jmd, 'JMD')}
                        </div>
                        <div className="text-sm text-muted-foreground">Jamaican Dollars</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {formatCurrency(yaadflexAccount.balance.usd, 'USD')}
                        </div>
                        <div className="text-sm text-muted-foreground">US Dollars</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold mb-2">Account #</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {maskAccountNumber(yaadflexAccount.accountNumber)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Earnings Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
                      <div className="text-2xl font-bold">{formatCurrency(yaadflexAccount.totalEarnings.today, 'JMD')}</div>
                      <div className="text-sm text-muted-foreground">Today</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <Clock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                      <div className="text-2xl font-bold">{formatCurrency(yaadflexAccount.totalEarnings.thisWeek, 'JMD')}</div>
                      <div className="text-sm text-muted-foreground">This Week</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <Calculator className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                      <div className="text-2xl font-bold">{formatCurrency(yaadflexAccount.totalEarnings.thisMonth, 'JMD')}</div>
                      <div className="text-sm text-muted-foreground">This Month</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <Banknote className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                      <div className="text-2xl font-bold">{formatCurrency(yaadflexAccount.totalEarnings.allTime, 'JMD')}</div>
                      <div className="text-sm text-muted-foreground">All Time</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Auto Transfer Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Automatic Transfer Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-semibold">
                            Auto-Transfer: {yaadflexAccount.autoTransferEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          When enabled, funds are automatically transferred to your primary bank account when balance reaches the threshold.
                        </p>
                        <div className="space-y-2">
                          <Label>Transfer Threshold</Label>
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(yaadflexAccount.transferThreshold, 'JMD')}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Primary Bank Account</Label>
                        <div className="mt-2">
                          {yaadflexAccount.primaryBankAccountId ? (
                            <div className="p-4 border rounded-lg">
                              <div className="font-semibold">Primary Account Set</div>
                              <div className="text-sm text-muted-foreground">
                                Transfers will go to your selected primary bank account
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 border rounded-lg border-dashed">
                              <div className="text-muted-foreground">
                                No primary account selected. Add a bank account and set it as primary.
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Create Your YaadFlex Business Account</h3>
                  <p className="text-muted-foreground mb-6">
                    Get a dedicated YaadFlex business account to receive payments from rides, property sales, and business partnerships automatically.
                  </p>
                  <Button 
                    onClick={() => createYaadFlexAccountMutation.mutate()}
                    disabled={createYaadFlexAccountMutation.isPending}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    data-testid="button-create-yaadflex-account"
                  >
                    {createYaadFlexAccountMutation.isPending ? "Creating Account..." : "Create YaadFlex Account"}
                  </Button>
                </CardContent>
              </Card>
            )}

          </TabsContent>

          {/* Bank Accounts */}
          <TabsContent value="bank-accounts" className="space-y-6">
            
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Bank Accounts</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAccountNumbers(!showAccountNumbers)}
                data-testid="button-toggle-account-numbers"
              >
                {showAccountNumbers ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showAccountNumbers ? 'Hide' : 'Show'} Account Numbers
              </Button>
            </div>

            {bankAccounts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-4">No Bank Accounts Connected</h3>
                  <p className="text-muted-foreground mb-6">
                    Connect your bank accounts to receive automatic transfers from your YaadFlex earnings.
                  </p>
                  <Button data-testid="button-add-first-account">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Bank Account
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bankAccounts.map((account) => (
                  <Card key={account.id} className={account.isPrimary ? 'ring-2 ring-green-500' : ''}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold">{account.bankName}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {account.isPrimary && (
                            <Badge className="bg-green-500/20 text-green-600 border-green-500/50">
                              Primary
                            </Badge>
                          )}
                          <Badge variant={account.isVerified ? "default" : "secondary"}>
                            {account.isVerified ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                            {account.isVerified ? 'Verified' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Account Holder:</span>
                          <span className="text-sm font-medium">{account.accountHolderName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Account Number:</span>
                          <span className="text-sm font-mono">{maskAccountNumber(account.accountNumber)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Type:</span>
                          <span className="text-sm capitalize">{account.accountType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Currency:</span>
                          <span className="text-sm">{account.currency}</span>
                        </div>
                      </div>

                      {account.balance && (
                        <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold">
                              {formatCurrency(account.balance, account.currency)}
                            </div>
                            <div className="text-xs text-muted-foreground">Current Balance</div>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex gap-2">
                        {!account.isPrimary && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPrimaryAccountMutation.mutate(account.id)}
                            disabled={setPrimaryAccountMutation.isPending}
                            data-testid={`button-set-primary-${account.id}`}
                          >
                            Set as Primary
                          </Button>
                        )}
                      </div>

                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions" className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <DollarSign className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                      <p className="text-muted-foreground">No transactions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getTransactionIcon(transaction.type)}
                            <div>
                              <div className="font-medium">{transaction.description}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(transaction.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                              {transaction.type === 'withdrawal' ? '-' : '+'}{formatCurrency(transaction.amount, transaction.currency)}
                            </div>
                            <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Add Bank Account */}
          <TabsContent value="add-account" className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Bank Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div>
                  <Label>Select Country</Label>
                  <Select value={selectedBankCountry} onValueChange={setSelectedBankCountry}>
                    <SelectTrigger data-testid="select-bank-country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jamaica">🇯🇲 Jamaica</SelectItem>
                      <SelectItem value="United States">🇺🇸 United States</SelectItem>
                      <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                      <SelectItem value="United Kingdom">🇬🇧 United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div>
                    <Label>Bank Name</Label>
                    {selectedBankCountry === 'Jamaica' ? (
                      <Select 
                        value={newBankAccount.bankName} 
                        onValueChange={(value) => setNewBankAccount({...newBankAccount, bankName: value})}
                      >
                        <SelectTrigger data-testid="select-bank-name">
                          <SelectValue placeholder="Select your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {jamaicanBanks.map((bank) => (
                            <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder="Enter your bank name"
                        value={newBankAccount.bankName}
                        onChange={(e) => setNewBankAccount({...newBankAccount, bankName: e.target.value})}
                        data-testid="input-bank-name"
                      />
                    )}
                  </div>

                  <div>
                    <Label>Account Holder Name</Label>
                    <Input
                      placeholder="Full name on the account"
                      value={newBankAccount.accountHolderName}
                      onChange={(e) => setNewBankAccount({...newBankAccount, accountHolderName: e.target.value})}
                      data-testid="input-account-holder"
                    />
                  </div>

                  <div>
                    <Label>Account Number</Label>
                    <Input
                      placeholder="Your account number"
                      value={newBankAccount.accountNumber}
                      onChange={(e) => setNewBankAccount({...newBankAccount, accountNumber: e.target.value})}
                      data-testid="input-account-number"
                    />
                  </div>

                  <div>
                    <Label>Routing/Transit Number</Label>
                    <Input
                      placeholder={selectedBankCountry === 'Jamaica' ? 'Transit number' : 'Routing number'}
                      value={newBankAccount.routingNumber}
                      onChange={(e) => setNewBankAccount({...newBankAccount, routingNumber: e.target.value})}
                      data-testid="input-routing-number"
                    />
                  </div>

                  <div>
                    <Label>Account Type</Label>
                    <Select 
                      value={newBankAccount.accountType} 
                      onValueChange={(value) => setNewBankAccount({...newBankAccount, accountType: value})}
                    >
                      <SelectTrigger data-testid="select-account-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Currency</Label>
                    <Select 
                      value={newBankAccount.currency} 
                      onValueChange={(value) => setNewBankAccount({...newBankAccount, currency: value})}
                    >
                      <SelectTrigger data-testid="select-currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JMD">🇯🇲 Jamaican Dollar (JMD)</SelectItem>
                        <SelectItem value="USD">🇺🇸 US Dollar (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Security & Privacy</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Your banking information is encrypted and secure</p>
                    <p>• We use bank-level security protocols</p>
                    <p>• Account verification takes 1-2 business days</p>
                    <p>• You can remove accounts anytime from settings</p>
                  </div>
                </div>

                <Button 
                  onClick={handleAddBankAccount}
                  disabled={addBankAccountMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  size="lg"
                  data-testid="button-add-bank-account"
                >
                  {addBankAccountMutation.isPending ? "Adding Account..." : "Add Bank Account"}
                </Button>

              </CardContent>
            </Card>

          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}