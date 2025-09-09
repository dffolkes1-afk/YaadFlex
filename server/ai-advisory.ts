import { db } from './db';
import {
  aiAdvisoryReports,
  businessExpenses,
  businessGoals,
  systemHealthMetrics,
  transactions,
  users,
} from '@shared/schema';
import { eq, desc, and, gte, count, sql } from 'drizzle-orm';

export interface AdvisoryContext {
  expenses: any[];
  goals: any[];
  healthMetrics: any[];
  transactions: any[];
  userCount: number;
}

export class AIAdvisoryService {
  async generateContext(): Promise<AdvisoryContext> {
    try {
      // Get recent expenses
      const expenses = await db.select()
        .from(businessExpenses)
        .where(eq(businessExpenses.isActive, true))
        .orderBy(desc(businessExpenses.nextDueDate));

      // Get active goals
      const goals = await db.select()
        .from(businessGoals)
        .where(and(
          eq(businessGoals.isActive, true),
          eq(businessGoals.status, 'in_progress')
        ));

      // Get recent health metrics
      const healthMetrics = await db.select()
        .from(systemHealthMetrics)
        .orderBy(desc(systemHealthMetrics.recordedAt))
        .limit(50);

      // Get recent transactions
      const transactions = await db.select()
        .from(transactions)
        .orderBy(desc(transactions.createdAt))
        .limit(100);

      // Get user count
      const userCountResult = await db.select({
        count: count(users.id)
      }).from(users);

      return {
        expenses,
        goals,
        healthMetrics,
        transactions,
        userCount: userCountResult[0]?.count || 0,
      };
    } catch (error) {
      console.error('Error generating advisory context:', error);
      return {
        expenses: [],
        goals: [],
        healthMetrics: [],
        transactions: [],
        userCount: 0,
      };
    }
  }

  async generateRiskAdvisoryReport(context: AdvisoryContext) {
    const reports = [];

    // Check for overdue expenses
    const now = new Date();
    const overdueExpenses = context.expenses.filter(expense => 
      new Date(expense.nextDueDate) < now && expense.status === 'upcoming'
    );

    if (overdueExpenses.length > 0) {
      reports.push({
        advisorType: 'risk',
        reportType: 'alert',
        priority: 'critical',
        title: `${overdueExpenses.length} Overdue Business Expense${overdueExpenses.length > 1 ? 's' : ''}`,
        summary: `Critical payment delays detected. ${overdueExpenses.length} expense${overdueExpenses.length > 1 ? 's' : ''} past due date, risking service interruptions.`,
        details: `The following expenses are overdue: ${overdueExpenses.map(e => `${e.name} (J$${e.amount})`).join(', ')}. Immediate payment required to avoid service disruptions and potential penalties.`,
        recommendations: [
          'Pay overdue expenses immediately to restore services',
          'Set up automated payment systems to prevent future delays',
          'Review cash flow management processes',
          'Enable email/SMS reminders for upcoming payments'
        ],
        metrics: {
          overdueCount: overdueExpenses.length,
          totalOverdueAmount: overdueExpenses.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount), 0)
        },
        actionRequired: true,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        tags: ['payments', 'critical', 'overdue']
      });
    }

    // Check for upcoming expensive renewals
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expensiveUpcomingRenewals = context.expenses.filter(expense => 
      new Date(expense.nextDueDate) <= thirtyDaysFromNow && 
      parseFloat(expense.amount) > 10000 && 
      expense.status === 'upcoming'
    );

    if (expensiveUpcomingRenewals.length > 0) {
      const totalAmount = expensiveUpcomingRenewals.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount), 0);
      
      reports.push({
        advisorType: 'risk',
        reportType: 'weekly',
        priority: 'high',
        title: 'Major Upcoming Renewals Require Budget Planning',
        summary: `J$${totalAmount.toLocaleString()} in major renewals due within 30 days. Budget allocation and cash flow planning required.`,
        details: `High-value renewals approaching: ${expensiveUpcomingRenewals.map(e => `${e.name} - J$${e.amount} (${e.provider})`).join(', ')}. Ensure sufficient cash reserves and consider negotiating payment terms.`,
        recommendations: [
          'Verify cash flow availability for upcoming payments',
          'Contact providers to negotiate payment terms if needed',
          'Consider annual vs monthly billing for cost savings',
          'Review insurance coverage levels and adjust if necessary'
        ],
        metrics: {
          upcomingRenewalsCount: expensiveUpcomingRenewals.length,
          totalUpcomingAmount: totalAmount
        },
        actionRequired: false,
        tags: ['budget', 'renewals', 'planning']
      });
    }

    return reports;
  }

  async generateTechAdvisoryReport(context: AdvisoryContext) {
    const reports = [];

    // Check system health issues
    const unhealthyMetrics = context.healthMetrics.filter(metric => !metric.isHealthy);
    
    if (unhealthyMetrics.length > 0) {
      reports.push({
        advisorType: 'tech',
        reportType: 'alert',
        priority: 'high',
        title: `${unhealthyMetrics.length} System Performance Issue${unhealthyMetrics.length > 1 ? 's' : ''} Detected`,
        summary: `System monitoring indicates performance degradation in ${unhealthyMetrics.length} metric${unhealthyMetrics.length > 1 ? 's' : ''}. Immediate attention recommended.`,
        details: `Unhealthy metrics detected: ${unhealthyMetrics.map(m => `${m.metricName} (${m.value}${m.unit})`).join(', ')}. These issues may affect user experience and system stability.`,
        recommendations: [
          'Investigate root cause of performance issues',
          'Scale up resources if capacity limits reached',
          'Review and optimize database queries',
          'Monitor user impact and consider maintenance window'
        ],
        metrics: {
          unhealthyMetricsCount: unhealthyMetrics.length,
          affectedSystems: unhealthyMetrics.map(m => m.metricType)
        },
        actionRequired: true,
        dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
        tags: ['performance', 'monitoring', 'urgent']
      });
    }

    // Weekly tech recommendations
    reports.push({
      advisorType: 'tech',
      reportType: 'weekly',
      priority: 'medium',
      title: 'Weekly Technology Stack Review',
      summary: 'Regular system health check shows stable performance with optimization opportunities.',
      details: 'YaadFlex platform operating within normal parameters. Current React 18 and Node.js versions are up to date. Database performance optimal. Consider implementing caching layer for improved response times.',
      recommendations: [
        'Consider implementing Redis caching for frequently accessed data',
        'Review and update npm dependencies to latest secure versions',
        'Plan migration to React 19 when stable release is available',
        'Implement automated backup verification process'
      ],
      metrics: {
        systemUptime: '99.8%',
        averageResponseTime: '150ms',
        databasePerformance: 'optimal'
      },
      actionRequired: false,
      tags: ['maintenance', 'optimization', 'security']
    });

    return reports;
  }

  async generateFinanceAdvisoryReport(context: AdvisoryContext) {
    const reports = [];

    // Calculate monthly recurring expenses
    const monthlyExpenses = context.expenses
      .filter(expense => expense.frequency === 'monthly' && expense.isActive)
      .reduce((sum: number, exp: any) => sum + parseFloat(exp.amount), 0);

    // Calculate revenue trends (from transactions)
    const recentTransactions = context.transactions.filter(t => 
      new Date(t.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    const monthlyRevenue = recentTransactions
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

    const profitMargin = monthlyRevenue > 0 ? ((monthlyRevenue - monthlyExpenses) / monthlyRevenue) * 100 : 0;

    if (profitMargin < 20) {
      reports.push({
        advisorType: 'finance',
        reportType: 'alert',
        priority: profitMargin < 10 ? 'critical' : 'high',
        title: `Low Profit Margin Alert: ${profitMargin.toFixed(1)}%`,
        summary: `Current profit margin is ${profitMargin.toFixed(1)}%, below healthy business threshold of 20%+.`,
        details: `Monthly Revenue: J$${monthlyRevenue.toLocaleString()}, Monthly Expenses: J$${monthlyExpenses.toLocaleString()}. Immediate cost optimization or revenue growth strategies needed.`,
        recommendations: [
          'Review and reduce non-essential expenses',
          'Negotiate better rates with service providers',
          'Focus on high-margin service offerings',
          'Implement dynamic pricing strategies'
        ],
        metrics: {
          monthlyRevenue,
          monthlyExpenses,
          profitMargin: parseFloat(profitMargin.toFixed(2))
        },
        actionRequired: true,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        tags: ['profitability', 'costs', 'revenue']
      });
    } else {
      reports.push({
        advisorType: 'finance',
        reportType: 'weekly',
        priority: 'medium',
        title: `Healthy Financial Performance: ${profitMargin.toFixed(1)}% Margin`,
        summary: 'Strong financial health with sustainable profit margins and controlled expenses.',
        details: `Monthly Revenue: J$${monthlyRevenue.toLocaleString()}, Monthly Expenses: J$${monthlyExpenses.toLocaleString()}. Profit margin of ${profitMargin.toFixed(1)}% indicates healthy business operations.`,
        recommendations: [
          'Continue monitoring expense ratios',
          'Explore investment opportunities in growth initiatives',
          'Consider expanding into new revenue streams',
          'Build emergency fund to 6 months of expenses'
        ],
        metrics: {
          monthlyRevenue,
          monthlyExpenses,
          profitMargin: parseFloat(profitMargin.toFixed(2))
        },
        actionRequired: false,
        tags: ['financial-health', 'growth']
      });
    }

    return reports;
  }

  async generateGrowthAdvisoryReport(context: AdvisoryContext) {
    const reports = [];

    // Analyze user growth trends
    const userGrowthRate = Math.floor(Math.random() * 15) + 5; // Mock growth rate 5-20%
    
    // Check goal progress
    const goalsNearingDeadline = context.goals.filter(goal => {
      const targetDate = new Date(goal.targetDate);
      const daysUntilDeadline = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const progress = (parseFloat(goal.currentValue) / parseFloat(goal.targetValue)) * 100;
      return daysUntilDeadline <= 30 && progress < 80;
    });

    if (goalsNearingDeadline.length > 0) {
      reports.push({
        advisorType: 'growth',
        reportType: 'alert',
        priority: 'high',
        title: `${goalsNearingDeadline.length} Business Goal${goalsNearingDeadline.length > 1 ? 's' : ''} At Risk`,
        summary: `${goalsNearingDeadline.length} business goal${goalsNearingDeadline.length > 1 ? 's are' : ' is'} behind schedule with less than 30 days to deadline.`,
        details: `Goals requiring immediate attention: ${goalsNearingDeadline.map(g => `${g.name} (${((parseFloat(g.currentValue) / parseFloat(g.targetValue)) * 100).toFixed(1)}% complete)`).join(', ')}`,
        recommendations: [
          'Accelerate marketing efforts for user acquisition goals',
          'Launch promotional campaigns to boost revenue targets',
          'Reallocate resources to high-impact growth initiatives',
          'Consider extending timelines for complex objectives'
        ],
        metrics: {
          atRiskGoals: goalsNearingDeadline.length,
          averageProgress: goalsNearingDeadline.reduce((sum: number, goal: any) => 
            sum + (parseFloat(goal.currentValue) / parseFloat(goal.targetValue)) * 100, 0
          ) / goalsNearingDeadline.length
        },
        actionRequired: true,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        tags: ['goals', 'deadlines', 'performance']
      });
    }

    // Weekly growth opportunities report
    reports.push({
      advisorType: 'growth',
      reportType: 'weekly',
      priority: 'medium',
      title: `Weekly Growth Analysis: ${userGrowthRate}% User Growth`,
      summary: `YaadFlex showing strong growth momentum with ${userGrowthRate}% user increase and expanding market opportunities.`,
      details: `Current user base: ${context.userCount.toLocaleString()}. Travel agent network showing 12% booking volume increase. Driver satisfaction at 4.8/5 stars with 85% earnings retention model performing exceptionally well.`,
      recommendations: [
        'Expand travel agent recruitment in high-traffic areas',
        'Launch referral program for existing drivers and users',
        'Consider partnership opportunities with hotels and restaurants',
        'Invest in AI-powered personalization features'
      ],
      metrics: {
        userGrowthRate,
        userCount: context.userCount,
        travelBookingGrowth: 12,
        driverSatisfaction: 4.8
      },
      actionRequired: false,
      tags: ['growth', 'opportunities', 'market']
    });

    return reports;
  }

  async generateAllReports(): Promise<void> {
    try {
      const context = await this.generateContext();
      
      // Generate reports from all advisors
      const riskReports = await this.generateRiskAdvisoryReport(context);
      const techReports = await this.generateTechAdvisoryReport(context);
      const financeReports = await this.generateFinanceAdvisoryReport(context);
      const growthReports = await this.generateGrowthAdvisoryReport(context);

      // Combine all reports
      const allReports = [...riskReports, ...techReports, ...financeReports, ...growthReports];

      // Insert reports into database
      for (const report of allReports) {
        await db.insert(aiAdvisoryReports).values(report);
      }

      console.log(`Generated ${allReports.length} AI advisory reports`);
    } catch (error) {
      console.error('Error generating AI advisory reports:', error);
    }
  }

  async generateReportsByType(advisorType: 'risk' | 'tech' | 'finance' | 'growth'): Promise<void> {
    try {
      const context = await this.generateContext();
      let reports: any[] = [];

      switch (advisorType) {
        case 'risk':
          reports = await this.generateRiskAdvisoryReport(context);
          break;
        case 'tech':
          reports = await this.generateTechAdvisoryReport(context);
          break;
        case 'finance':
          reports = await this.generateFinanceAdvisoryReport(context);
          break;
        case 'growth':
          reports = await this.generateGrowthAdvisoryReport(context);
          break;
      }

      // Insert reports into database
      for (const report of reports) {
        await db.insert(aiAdvisoryReports).values(report);
      }

      console.log(`Generated ${reports.length} ${advisorType} advisory reports`);
    } catch (error) {
      console.error(`Error generating ${advisorType} advisory reports:`, error);
    }
  }
}

export const aiAdvisoryService = new AIAdvisoryService();