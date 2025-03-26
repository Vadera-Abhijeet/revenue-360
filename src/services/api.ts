// Mock API service for Revenue-360
// In a real application, this would connect to a backend API

import { IUser, IPreferences, ISettings } from "../interfaces";

// Helper function to generate random data
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomPercentage = (min: number, max: number) => {
  return +(Math.random() * (max - min) + min).toFixed(2);
};

const randomFloat = (min: number, max: number, decimals: number = 2) => {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
};

export const allRoleDemoUsers = [{
  "id": "a08f1321-f046-40fe-ae73-0a0b57d7e568",
  "email": "superadmin@gmail.com",
  "role": "super-admin",
  "password": "Admin@123",
  "permissions": [],
  "photoURL": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
  "name": "Super Admin",
  "status": "active",
  "company": "Demo Company",
  "createdAt": "2025-03-25T08:43:47.510Z",
  "updatedAt": "2025-03-25T08:43:47.510Z"
}, {
  "id": "149a0132-9fa3-49bd-bc9e-e5a33aad517f",
  "email": "admin@gmail.com",
  "role": "admin",
  "password": "Admin@123",
  "permissions": [],
  "company": "Demo Company",
  "photoURL": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
  "name": "Admin",
  "status": "active",
  "createdAt": "2025-03-25T13:54:57.978Z",
  "updatedAt": "2025-03-25T13:54:57.978Z"
}, {
  "id": "149a0132-9fa3-49bd-bc9e-e5a33aad519d",
  "email": "subadmin@gmail.com",
  "role": "sub-admin",
  "password": "Admin@123",
  "permissions": [],
  "company": "Demo Company",
  "photoURL": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
  "name": "Sub Admin",
  "status": "active",
  "createdAt": "2025-03-25T13:54:57.978Z",
  "updatedAt": "2025-03-25T13:54:57.978Z"
}]

// Dashboard data
export const fetchDashboardData = async (startDate: Date, endDate: Date) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate dates between start and end date
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Generate revenue vs spend data
  const revenueVsSpend = dates.map((date) => {
    const revenue = randomNumber(5000, 15000);
    const adSpend = randomNumber(2000, 8000);
    return {
      date: date.toISOString().split("T")[0],
      revenue,
      adSpend,
    };
  });

  // Generate top apps data
  const topApps = [
    {
      name: "Puzzle Master",
      revenue: randomNumber(20000, 50000),
      cost: randomNumber(5000, 15000),
      roi: randomPercentage(10, 30),
    },
    {
      name: "Fitness Tracker",
      revenue: randomNumber(15000, 40000),
      cost: randomNumber(3000, 10000),
      roi: randomPercentage(8, 25),
    },
    {
      name: "Recipe Book",
      revenue: randomNumber(10000, 30000),
      cost: randomNumber(2000, 8000),
      roi: randomPercentage(5, 20),
    },
    {
      name: "Weather App",
      revenue: randomNumber(8000, 25000),
      cost: randomNumber(1500, 7000),
      roi: randomPercentage(3, 18),
    },
    {
      name: "Task Manager",
      revenue: randomNumber(5000, 20000),
      cost: randomNumber(1000, 5000),
      roi: randomPercentage(2, 15),
    },
  ];

  // Generate recent campaigns data
  const recentCampaigns = [
    {
      id: "c1",
      name: "Summer Promotion",
      status: "active",
      spend: randomNumber(5000, 10000),
      conversions: randomNumber(500, 2000),
      cpa: randomNumber(5, 15),
    },
    {
      id: "c2",
      name: "New User Acquisition",
      status: "active",
      spend: randomNumber(3000, 8000),
      conversions: randomNumber(300, 1500),
      cpa: randomNumber(6, 16),
    },
    {
      id: "c3",
      name: "Re-engagement",
      status: "paused",
      spend: randomNumber(2000, 6000),
      conversions: randomNumber(200, 1000),
      cpa: randomNumber(7, 17),
    },
    {
      id: "c4",
      name: "Holiday Special",
      status: "completed",
      spend: randomNumber(1000, 4000),
      conversions: randomNumber(100, 800),
      cpa: randomNumber(8, 18),
    },
    {
      id: "c5",
      name: "Brand Awareness",
      status: "active",
      spend: randomNumber(500, 3000),
      conversions: randomNumber(50, 500),
      cpa: randomNumber(9, 19),
    },
  ];

  // Calculate summary data
  const totalRevenue = revenueVsSpend.reduce(
    (sum, day) => sum + day.revenue,
    0
  );
  const totalAdSpend = revenueVsSpend.reduce(
    (sum, day) => sum + day.adSpend,
    0
  );
  const roi = ((totalRevenue - totalAdSpend) / totalAdSpend) * 100;

  // Previous period data (for comparison)
  const previousRevenue = totalRevenue * (1 - (Math.random() * 0.3 - 0.15)); // -15% to +15%
  const previousAdSpend = totalAdSpend * (1 - (Math.random() * 0.3 - 0.15)); // -15% to +15%
  const previousRoi =
    ((previousRevenue - previousAdSpend) / previousAdSpend) * 100;

  // Estimated Revenue Calculation (Example: applying a future growth factor)
  const estimatedRevenue = totalRevenue * (1 + randomPercentage(5, 15) / 100);
  const previousEstimatedRevenue =
    previousRevenue * (1 + randomPercentage(5, 15) / 100);

  return {
    summary: {
      revenue: totalRevenue,
      previousRevenue,
      estimatedRevenue,
      previousEstimatedRevenue,
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

export const fetchApps = async () => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const platforms = ["Android", "iOS"];
  const appNames = [
    "Android version update info",
    "Typing Practice Master",
    "GPS Photo: TimeStamp",
    "My Stuff: Inventory Organiser",
    "Draw Trace: Photos & Shape",
    "Reading Assistant Plus",
    "Countdown calendar widget",
    "Expense Tracker Pro",
    "Workout Planner",
    "Travel Diary",
  ];

  const platformIcons: Record<string, string> = {
    Android: "https://cdn-icons-png.flaticon.com/512/174/174836.png", // Android logo
    iOS: "https://cdn-icons-png.flaticon.com/512/0/747.png", // Apple logo
  };

  // Generate mock apps data
  const apps = Array.from({ length: appNames.length }, (_, i) => {
    const platform = platforms[randomNumber(0, platforms.length - 1)];
    const estimateRevenueUSD = randomFloat(2, 800, 2);
    const totalCostUSD = randomFloat(0, estimateRevenueUSD, 2);
    const totalCostINR = totalCostUSD * 87; // Assume conversion rate ₹87
    const netUSD = parseFloat((estimateRevenueUSD - totalCostUSD).toFixed(2));
    const percentage = parseFloat(
      ((netUSD / estimateRevenueUSD) * 1).toFixed(2)
    );

    return {
      id: `app-${i + 1}`,
      name: appNames[i],
      platform,
      icon: platformIcons[platform], // Assign platform-based icon
      estimateRevenueUSD,
      estimateRevenue: `${estimateRevenueUSD} USD`,
      totalCostUSD,
      totalCostINR: `${totalCostINR.toFixed(2)} INR`,
      netUSD,
      percentage,
    };
  });

  return apps;
};

// App details data
export const fetchAppDetails = async (
  appId: string,
  startDate: Date,
  endDate: Date
) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate dates between start and end date
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Generate revenue trend data
  const revenueData = dates.map((date) => {
    return {
      date: date.toISOString().split("T")[0],
      revenue: randomNumber(500, 2000),
      adRevenue: randomNumber(300, 1000),
      iapRevenue: randomNumber(200, 1000),
    };
  });

  // Generate user data
  const userData = dates.map((date) => {
    const newUsers = randomNumber(100, 500);
    const activeUsers = randomNumber(500, 2000);
    return {
      date: date.toISOString().split("T")[0],
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
    {
      country: "United States",
      users: randomNumber(5000, 10000),
      revenue: randomNumber(10000, 30000),
    },
    {
      country: "United Kingdom",
      users: randomNumber(2000, 5000),
      revenue: randomNumber(5000, 15000),
    },
    {
      country: "Germany",
      users: randomNumber(1500, 4000),
      revenue: randomNumber(3000, 10000),
    },
    {
      country: "Japan",
      users: randomNumber(1000, 3000),
      revenue: randomNumber(2000, 8000),
    },
    {
      country: "India",
      users: randomNumber(800, 2500),
      revenue: randomNumber(1500, 6000),
    },
    {
      country: "Brazil",
      users: randomNumber(600, 2000),
      revenue: randomNumber(1000, 5000),
    },
    {
      country: "Canada",
      users: randomNumber(500, 1500),
      revenue: randomNumber(800, 4000),
    },
    {
      country: "Australia",
      users: randomNumber(400, 1200),
      revenue: randomNumber(600, 3000),
    },
    {
      country: "France",
      users: randomNumber(300, 1000),
      revenue: randomNumber(500, 2500),
    },
    {
      country: "Italy",
      users: randomNumber(200, 800),
      revenue: randomNumber(400, 2000),
    },
  ];

  // Generate version data
  const versionData = [
    {
      version: "3.2.1",
      users: randomNumber(5000, 10000),
      crashes: randomNumber(10, 50),
    },
    {
      version: "3.2.0",
      users: randomNumber(2000, 5000),
      crashes: randomNumber(20, 80),
    },
    {
      version: "3.1.5",
      users: randomNumber(1000, 3000),
      crashes: randomNumber(30, 100),
    },
    {
      version: "3.1.0",
      users: randomNumber(500, 1500),
      crashes: randomNumber(40, 120),
    },
    {
      version: "3.0.0",
      users: randomNumber(200, 800),
      crashes: randomNumber(50, 150),
    },
  ];

  // Generate Campaign data
  const campaignData = [
    { date: "2024-07-01", clicks: 120, conversions: 15, impressions: 1500 },
    { date: "2024-07-02", clicks: 180, conversions: 25, impressions: 2200 },
    { date: "2024-07-03", clicks: 150, conversions: 18, impressions: 1900 },
    { date: "2024-07-04", clicks: 170, conversions: 22, impressions: 2100 },
    { date: "2024-07-05", clicks: 200, conversions: 30, impressions: 2500 },
    { date: "2024-07-06", clicks: 140, conversions: 20, impressions: 1800 },
    { date: "2024-07-07", clicks: 220, conversions: 35, impressions: 2800 },
    { date: "2024-07-08", clicks: 190, conversions: 28, impressions: 2300 },
    { date: "2024-07-09", clicks: 210, conversions: 33, impressions: 2600 },
    { date: "2024-07-10", clicks: 175, conversions: 24, impressions: 2000 },
  ];

  return {
    id: appId,
    name: "Fitness Tracker Pro",
    platform: "android",
    category: "Health & Fitness",
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
    campaignData,
  };
};

// Campaigns data
export const fetchCampaigns = async () => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const platforms = ["Android", "iOS"];
  const appNames = [
    "Android version update info",
    "Typing Practice Master",
    "GPS Photo: TimeStamp",
    "My Stuff: Inventory Organiser",
    "Draw Trace: Photos & Shape",
    "Reading Assistant Plus",
    "Countdown calendar widget",
    "Expense Tracker Pro",
    "Workout Planner",
    "Travel Diary",
  ];
  const countries = [
    { name: "US", flag: "https://flagcdn.com/us.svg" },
    { name: "UK", flag: "https://flagcdn.com/gb.svg" },
    { name: "India", flag: "https://flagcdn.com/in.svg" },
    { name: "Germany", flag: "https://flagcdn.com/de.svg" },
    { name: "France", flag: "https://flagcdn.com/fr.svg" },
    { name: "Canada", flag: "https://flagcdn.com/ca.svg" },
    { name: "Australia", flag: "https://flagcdn.com/au.svg" },
  ];

  const platformIcons: Record<string, string> = {
    Android: "https://cdn-icons-png.flaticon.com/512/174/174836.png", // Android logo
    iOS: "https://cdn-icons-png.flaticon.com/512/0/747.png", // Apple logo
  };

  // Generate mock campaign data
  const campaigns = appNames.map((name, i) => {
    const platform = platforms[randomNumber(0, platforms.length - 1)];
    const country = countries[randomNumber(0, countries.length - 1)];
    const estimateRevenueUSD = randomFloat(2, 800, 2);
    const totalCostUSD = randomFloat(0, estimateRevenueUSD, 2);
    const totalCostINR = totalCostUSD * 87; // Assume conversion rate ₹87
    const netUSD = parseFloat((estimateRevenueUSD - totalCostUSD).toFixed(2));
    const percentage = parseFloat(
      ((netUSD / estimateRevenueUSD) * 1).toFixed(2)
    );
    const lastBidINR = randomFloat(50, 200, 2);
    const currentBidINR = randomFloat(50, 200, 2);

    // Mock chart data (impressions, clicks, conversions, revenue trends)
    const chartData = Array.from({ length: 7 }, (_, day) => ({
      date: `Day ${day + 1}`,
      impressions: randomNumber(500, 5000),
      clicks: randomNumber(50, 500),
      conversions: randomNumber(5, 50),
      revenue: randomFloat(10, 200, 2),
    }));

    // Generate a random number of campaign entries
    const campaignCount = randomNumber(2, 5);
    const campaignData = Array.from({ length: campaignCount }, (_, index) => ({
      campaign: `Campaign ${index + 1}`,
      cost: randomFloat(50, 1500, 2),
    }));

    return {
      id: `campaign-${i + 1}`,
      name,
      platform,
      icon: platformIcons[platform],
      country: country.name,
      flag: country.flag,
      estimateRevenueUSD,
      estimateRevenue: `${estimateRevenueUSD} USD`,
      totalCostUSD,
      totalCostINR: `${totalCostINR.toFixed(2)} INR`,
      netUSD,
      percentage,
      lastBidINR: `${lastBidINR.toFixed(2)} INR`,
      currentBidINR: `${currentBidINR.toFixed(2)} INR`,
      chartData,
      campaigns: {
        totalCost: campaignData.reduce((sum, c) => sum + c.cost, 0),
        data: campaignData,
      },
    };
  });

  return campaigns;
};

// Notifications data
export const fetchNotifications = async () => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: "1",
      type: "warning",
      title: "High Spend Alert",
      message:
        'Your Google Ads campaign "Summer Promotion" has exceeded the daily budget by 15%.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "New Version Detected",
      message:
        'A new version of "Fitness Tracker Pro" (v3.2.1) has been detected on the Play Store.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: "3",
      type: "success",
      title: "Campaign Goal Reached",
      message:
        'Your "New User Acquisition" campaign has reached its conversion goal.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "4",
      type: "error",
      title: "Integration Error",
      message:
        "Failed to sync data from AdMob. Please check your integration settings.",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: "5",
      type: "warning",
      title: "Retention Drop",
      message:
        'Day 7 retention for "Budget Planner" has dropped by 8% in the last week.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "6",
      type: "info",
      title: "New Review",
      message: 'Your app "Meditation Master" received a new 5-star review.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "7",
      type: "success",
      title: "Revenue Milestone",
      message:
        'Congratulations! Your app "Fitness Tracker Pro" has reached $100,000 in lifetime revenue.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
    },
  ];
};

// Settings data
export const fetchUserSettings = async () => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    account: {
      name: currentUser.name || "Demo User",
      email: currentUser.email || "demo@example.com",
      company: currentUser.company || "Demo Company",
      role: currentUser.role || "admin",
      timezone: currentUser.timezone || "America/New_York",
      photoURL: currentUser.photoURL || "https://via.placeholder.com/150",
      id: currentUser.id || "1234567890",
      password: currentUser.password || "password",
      permissions: currentUser.permissions || [],
      status: currentUser.status || "active",
      isNewMerchant: currentUser.isNewMerchant || false,
      createdAt: currentUser.createdAt || new Date(),
      updatedAt: currentUser.updatedAt || new Date(),
    },
    integrations: [
      {
        inward: {
          platform: "googleAds",
          connected: true,
          accountEmail: "user1@example.com",
          accountId: "123-456-7890",
        },
        outward: {
          platform: "adMob",
          connected: true,
          accountEmail: "user2@example.com",
          accountId: "987-654-3210",
        },
      },
      {
        inward: {
          platform: "facebook",
          connected: true,
          accountEmail: "user3@example.com",
          accountId: "FB-123456",
        },
        outward: {
          platform: "adMob",
          connected: false,
          accountEmail: "user4@example.com",
          accountId: "987-654-3210",
        },
      },
      {
        inward: {
          platform: "facebook",
          connected: false,
          accountEmail: "user5@example.com",
          accountId: "FB-789101",
        },
        outward: {
          platform: "googleAds",
          connected: true,
          accountEmail: "user6@example.com",
          accountId: "456-789-0123",
        },
      },
    ],
    preferences: {
      language: "en",
      currency: "USD",
      theme: "light",
      emailNotifications: true,
      pushNotifications: true,
      dataRefreshRate: "1h",
    },
    team: [
      {
        id: "user1",
        name: "Demo User",
        email: "demo@example.com",
        role: "Administrator",
        status: "active",
      },
      {
        id: "user2",
        name: "John Doe",
        email: "john@example.com",
        role: "Editor",
        status: "active",
      },
      {
        id: "user3",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "Viewer",
        status: "pending",
      },
    ],
  } as ISettings;
};

// Helper function to convert file to Base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to validate image dimensions and size
const validateImage = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const maxDimension = 1000; // Max width/height in pixels
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes

      if (file.size > maxSize) {
        alert("Image size should be less than 5MB");
        resolve(false);
      } else if (img.width > maxDimension || img.height > maxDimension) {
        alert("Image dimensions should be less than 1000x1000 pixels");
        resolve(false);
      } else {
        resolve(true);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve(false);
    };
  });
};

// Update user settings
export const updateUserSettings = async (settings: {
  account: IUser;
  preferences: IPreferences;
  profilePic?: File;
}) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Handle profile picture if provided
  if (settings.profilePic) {
    try {
      // Validate file type
      if (!settings.profilePic.type.startsWith('image/')) {
        throw new Error("Please upload a valid image file");
      }

      // Validate image dimensions and size
      const isValid = await validateImage(settings.profilePic);
      if (!isValid) {
        throw new Error("Invalid image dimensions or size");
      }

      // Convert to Base64
      const base64String = await convertToBase64(settings.profilePic);
      settings.account.photoURL = base64String;

      // Store in localStorage as a backup
      localStorage.setItem('tempProfilePic', base64String);
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error("Error processing image. Please try again.");
    }
  }

  // Save settings to localStorage with user-specific key
  localStorage.setItem(`settings_${currentUser.id}`, JSON.stringify(settings));

  // Update user info in localStorage if relevant fields changed
  if (settings.account.name !== currentUser.name ||
    settings.account.email !== currentUser.email ||
    settings.account.photoURL !== currentUser.photoURL) {
    const updatedUser = {
      ...currentUser,
      name: settings.account.name,
      email: settings.account.email,
      photoURL: settings.account.photoURL,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }

  return { success: true };
};
