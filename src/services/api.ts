// Mock API service for Revenue-360
// In a real application, this would connect to a backend API

// Helper function to generate random data
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomPercentage = (min: number, max: number) => {
  return +(Math.random() * (max - min) + min).toFixed(2);
};

// Dashboard data
export const fetchDashboardData = async (startDate: Date, endDate: Date) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Generate dates between start and end date
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Generate revenue vs spend data
  const revenueVsSpend = dates.map(date => {
    const revenue = randomNumber(5000, 15000);
    const adSpend = randomNumber(2000, 8000);
    return {
      date: date.toISOString().split('T')[0],
      revenue,
      adSpend,
    };
  });

  // Generate top apps data
  const topApps = [
    { name: 'Puzzle Master', revenue: randomNumber(20000, 50000), installs: randomNumber(5000, 15000), roi: randomPercentage(10, 30) },
    { name: 'Fitness Tracker', revenue: randomNumber(15000, 40000), installs: randomNumber(3000, 10000), roi: randomPercentage(8, 25) },
    { name: 'Recipe Book', revenue: randomNumber(10000, 30000), installs: randomNumber(2000, 8000), roi: randomPercentage(5, 20) },
    { name: 'Weather App', revenue: randomNumber(8000, 25000), installs: randomNumber(1500, 7000), roi: randomPercentage(3, 18) },
    { name: 'Task Manager', revenue: randomNumber(5000, 20000), installs: randomNumber(1000, 5000), roi: randomPercentage(2, 15) },
  ];

  // Generate recent campaigns data
  const recentCampaigns = [
    { id: 'c1', name: 'Summer Promotion', status: 'active', spend: randomNumber(5000, 10000), conversions: randomNumber(500, 2000), cpa: randomNumber(5, 15) },
    { id: 'c2', name: 'New User Acquisition', status: 'active', spend: randomNumber(3000, 8000), conversions: randomNumber(300, 1500), cpa: randomNumber(6, 16) },
    { id: 'c3', name: 'Re-engagement', status: 'paused', spend: randomNumber(2000, 6000), conversions: randomNumber(200, 1000), cpa: randomNumber(7, 17) },
    { id: 'c4', name: 'Holiday Special', status: 'completed', spend: randomNumber(1000, 4000), conversions: randomNumber(100, 800), cpa: randomNumber(8, 18) },
    { id: 'c5', name: 'Brand Awareness', status: 'active', spend: randomNumber(500, 3000), conversions: randomNumber(50, 500), cpa: randomNumber(9, 19) },
  ];

  // Calculate summary data
  const totalRevenue = revenueVsSpend.reduce((sum, day) => sum + day.revenue, 0);
  const totalAdSpend = revenueVsSpend.reduce((sum, day) => sum + day.adSpend, 0);
  const roi = ((totalRevenue - totalAdSpend) / totalAdSpend) * 100;

  // Previous period data (for comparison)
  const previousRevenue = totalRevenue * (1 - (Math.random() * 0.3 - 0.15)); // -15% to +15%
  const previousAdSpend = totalAdSpend * (1 - (Math.random() * 0.3 - 0.15)); // -15% to +15%
  const previousRoi = ((previousRevenue - previousAdSpend) / previousAdSpend) * 100;

  return {
    summary: {
      revenue: totalRevenue,
      previousRevenue,
      adSpend: totalAdSpend,
      previousAdSpend,
      roi,
      previousRoi,
      activeApps: randomNumber(5, 15),
      previousActiveApps: randomNumber(5, 15),
    },
    revenueVsSpend,
    topApps,
    recentCampaigns,
  };
};

// App list data
export const fetchApps = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const platforms = ['android', 'ios', 'web', 'cross-platform'];
  const statuses = ['active', 'inactive', 'pending'];

  // Generate 10 random apps
  const apps = Array.from({ length: 10 }, (_, i) => {
    const revenue = randomNumber(5000, 50000);
    const installs = randomNumber(1000, 100000);
    const uninstalls = randomNumber(100, installs * 0.3);
    const retention = randomPercentage(30, 95);
    const rating = randomNumber(30, 50) / 10; // 3.0 to 5.0

    return {
      id: `app-${i + 1}`,
      name: [
        'Puzzle Master',
        'Fitness Tracker',
        'Recipe Book',
        'Weather App',
        'Task Manager',
        'Music Player',
        'Photo Editor',
        'News Reader',
        'Language Learner',
        'Meditation Guide',
      ][i],
      platform: platforms[randomNumber(0, platforms.length - 1)],
      revenue,
      installs,
      uninstalls,
      retention,
      rating,
      status: statuses[randomNumber(0, statuses.length - 1)] as 'active' | 'inactive' | 'pending',
    };
  });

  return apps;
};

// App details data
export const fetchAppDetails = async (appId: string, startDate: Date, endDate: Date) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Generate dates between start and end date
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Generate revenue trend data
  const revenueData = dates.map(date => {
    return {
      date: date.toISOString().split('T')[0],
      revenue: randomNumber(500, 2000),
      adRevenue: randomNumber(300, 1000),
      iapRevenue: randomNumber(200, 1000),
    };
  });

  // Generate user data
  const userData = dates.map(date => {
    const newUsers = randomNumber(100, 500);
    const activeUsers = randomNumber(500, 2000);
    return {
      date: date.toISOString().split('T')[0],
      newUsers,
      activeUsers,
      totalUsers: activeUsers + randomNumber(5000, 10000),
    };
  });

  // Generate retention data
  const retentionData = [
    { day: 1, retention: randomNumber(60, 80) },
    { day: 3, retention: randomNumber(40, 60) },
    { day: 7, retention: randomNumber(30, 50) },
    { day: 14, retention: randomNumber(25, 40) },
    { day: 30, retention: randomNumber(20, 35) },
  ];

  // Generate country data
  const countryData = [
    { country: 'United States', users: randomNumber(5000, 10000), revenue: randomNumber(10000, 30000) },
    { country: 'United Kingdom', users: randomNumber(2000, 5000), revenue: randomNumber(5000, 15000) },
    { country: 'Germany', users: randomNumber(1500, 4000), revenue: randomNumber(3000, 10000) },
    { country: 'Japan', users: randomNumber(1000, 3000), revenue: randomNumber(2000, 8000) },
    { country: 'India', users: randomNumber(800, 2500), revenue: randomNumber(1500, 6000) },
    { country: 'Brazil', users: randomNumber(600, 2000), revenue: randomNumber(1000, 5000) },
    { country: 'Canada', users: randomNumber(500, 1500), revenue: randomNumber(800, 4000) },
    { country: 'Australia', users: randomNumber(400, 1200), revenue: randomNumber(600, 3000) },
    { country: 'France', users: randomNumber(300, 1000), revenue: randomNumber(500, 2500) },
    { country: 'Italy', users: randomNumber(200, 800), revenue: randomNumber(400, 2000) },
  ];

  // Generate version data
  const versionData = [
    { version: '3.2.1', users: randomNumber(5000, 10000), crashes: randomNumber(10, 50) },
    { version: '3.2.0', users: randomNumber(2000, 5000), crashes: randomNumber(20, 80) },
    { version: '3.1.5', users: randomNumber(1000, 3000), crashes: randomNumber(30, 100) },
    { version: '3.1.0', users: randomNumber(500, 1500), crashes: randomNumber(40, 120) },
    { version: '3.0.0', users: randomNumber(200, 800), crashes: randomNumber(50, 150) },
  ];

  return {
    id: appId,
    name: 'Fitness Tracker Pro',
    platform: 'android',
    category: 'Health & Fitness',
    summary: {
      revenue: 85000,
      previousRevenue: 75000,
      installs: 45000,
      previousInstalls: 40000,
      activeUsers: 28000,
      previousActiveUsers: 25000,
      retention: 72,
      previousRetention: 68,
      rating: 4.7,
      previousRating: 4.6,
    },
    revenueData,
    userData,
    retentionData,
    countryData,
    versionData,
  };
};

// Campaigns data
export const fetchCampaigns = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return [
    {
      id: 'campaign1',
      name: 'Summer Promotion',
      platform: 'Google Ads',
      status: 'active',
      budget: 10000,
      spend: 8500,
      impressions: 500000,
      clicks: 25000,
      ctr: 5.0,
      cpc: 0.34,
      installs: 5000,
      cpi: 1.70,
      conversions: 1500,
      cpa: 5.67,
      revenue: 15000,
      roi: 76.5,
    },
    {
      id: 'campaign2',
      name: 'New User Acquisition',
      platform: 'Facebook Ads',
      status: 'active',
      budget: 8000,
      spend: 6500,
      impressions: 400000,
      clicks: 20000,
      ctr: 5.0,
      cpc: 0.33,
      installs: 4000,
      cpi: 1.63,
      conversions: 1200,
      cpa: 5.42,
      revenue: 12000,
      roi: 84.6,
    },
    {
      id: 'campaign3',
      name: 'Re-engagement',
      platform: 'Google Ads',
      status: 'paused',
      budget: 5000,
      spend: 4200,
      impressions: 300000,
      clicks: 15000,
      ctr: 5.0,
      cpc: 0.28,
      installs: 3000,
      cpi: 1.40,
      conversions: 900,
      cpa: 4.67,
      revenue: 9000,
      roi: 114.3,
    },
    {
      id: 'campaign4',
      name: 'Holiday Special',
      platform: 'TikTok Ads',
      status: 'ended',
      budget: 6000,
      spend: 6000,
      impressions: 350000,
      clicks: 17500,
      ctr: 5.0,
      cpc: 0.34,
      installs: 3500,
      cpi: 1.71,
      conversions: 1050,
      cpa: 5.71,
      revenue: 10500,
      roi: 75.0,
    },
    {
      id: 'campaign5',
      name: 'Brand Awareness',
      platform: 'Apple Search Ads',
      status: 'active',
      budget: 4000,
      spend: 3200,
      impressions: 200000,
      clicks: 10000,
      ctr: 5.0,
      cpc: 0.32,
      installs: 2000,
      cpi: 1.60,
      conversions: 600,
      cpa: 5.33,
      revenue: 6000,
      roi: 87.5,
    },
    {
      id: 'campaign6',
      name: 'Retargeting Campaign',
      platform: 'Facebook Ads',
      status: 'active',
      budget: 3000,
      spend: 2500,
      impressions: 150000,
      clicks: 7500,
      ctr: 5.0,
      cpc: 0.33,
      installs: 1500,
      cpi: 1.67,
      conversions: 450,
      cpa: 5.56,
      revenue: 4500,
      roi: 80.0,
    },
    {
      id: 'campaign7',
      name: 'Video Campaign',
      platform: 'TikTok Ads',
      status: 'paused',
      budget: 5500,
      spend: 4800,
      impressions: 280000,
      clicks: 14000,
      ctr: 5.0,
      cpc: 0.34,
      installs: 2800,
      cpi: 1.71,
      conversions: 840,
      cpa: 5.71,
      revenue: 8400,
      roi: 75.0,
    },
  ];
};

// Notifications data
export const fetchNotifications = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      type: 'warning',
      title: 'High Spend Alert',
      message: 'Your Google Ads campaign "Summer Promotion" has exceeded the daily budget by 15%.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'New Version Detected',
      message: 'A new version of "Fitness Tracker Pro" (v3.2.1) has been detected on the Play Store.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: '3',
      type: 'success',
      title: 'Campaign Goal Reached',
      message: 'Your "New User Acquisition" campaign has reached its conversion goal.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: '4',
      type: 'error',
      title: 'Integration Error',
      message: 'Failed to sync data from AdMob. Please check your integration settings.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: '5',
      type: 'warning',
      title: 'Retention Drop',
      message: 'Day 7 retention for "Budget Planner" has dropped by 8% in the last week.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: '6',
      type: 'info',
      title: 'New Review',
      message: 'Your app "Meditation Master" received a new 5-star review.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: '7',
      type: 'success',
      title: 'Revenue Milestone',
      message: 'Congratulations! Your app "Fitness Tracker Pro" has reached $100,000 in lifetime revenue.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
    },
  ];
};

// Settings data
export const fetchUserSettings = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    account: {
      name: 'Demo User',
      email: 'demo@example.com',
      company: 'Demo Company',
      role: 'Administrator',
      timezone: 'America/New_York',
    },
    integrations: {
      googleAds: true,
      adMob: true,
      firebase: true,
      playStore: true,
      appStore: false,
      facebook: false,
      appsFlyer: false,
      adjust: false,
    },
    preferences: {
      language: 'en',
      currency: 'USD',
      theme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      dataRefreshRate: '1h',
    },
    team: [
      {
        id: 'user1',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'Administrator',
        status: 'active',
      },
      {
        id: 'user2',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Editor',
        status: 'active',
      },
      {
        id: 'user3',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Viewer',
        status: 'pending',
      },
    ],
  };
};

// Update user settings
export const updateUserSettings = async (settings: any) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would send the updated settings to the server
  console.log('Settings updated:', settings);
  
  return { success: true };
};