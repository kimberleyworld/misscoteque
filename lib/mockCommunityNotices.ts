import { CommunityNotice } from "@prisma/client";

export const mockCommunityNotices: CommunityNotice[] = [
  {
    id: "mock-notice-1",
    title: "Community Garden Volunteers Needed",
    description: "We're looking for volunteers to help maintain our community garden. All skill levels welcome!",
    contactDetails: "Contact Sarah at sarah@example.com or call 555-0101",
    link: "https://example.com/garden-volunteers",
    isPinned: true,
    isActive: true,
    isApproved: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "mock-notice-2",
    title: "Free ESL Classes Starting Next Month",
    description: "English as Second Language classes for adults. Free registration, materials provided. Classes held every Tuesday and Thursday evening.",
    contactDetails: "Email: classes@community.org or visit our office at 123 Main St",
    link: "https://example.com/esl-classes",
    isPinned: false,
    isActive: true,
    isApproved: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: "mock-notice-3",
    title: "Youth Basketball League Registrations Open",
    description: "Sign up your kids (ages 8-16) for our summer basketball league. Games every Saturday morning. Register by May 31st.",
    contactDetails: "Contact Coach Marcus at basketball@community.org",
    link: "https://example.com/basketball-league",
    isPinned: false,
    isActive: true,
    isApproved: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "mock-notice-4",
    title: "Local Food Bank Accepting Donations",
    description: "Our community food bank needs your help! Accepting non-perishable items, fresh produce, and monetary donations.",
    contactDetails: "Drop off at 456 Oak Avenue, Mon-Fri 9am-5pm. Questions: foodbank@community.org",
    link: "https://example.com/food-bank",
    isPinned: false,
    isActive: true,
    isApproved: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "mock-notice-5",
    title: "Senior Wellness Program - Free Yoga Classes",
    description: "Gentle yoga classes designed for seniors. Improve flexibility, balance, and well-being. No experience necessary.",
    contactDetails: "Classes at Community Center, Tuesdays 10am. Call 555-0150 to register",
    link: "https://example.com/senior-yoga",
    isPinned: false,
    isActive: true,
    isApproved: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

export function getMockCommunityNotices(): CommunityNotice[] {
  return mockCommunityNotices;
}

export function getMockRecentNotices(): CommunityNotice[] {
  // Return only notices from the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return mockCommunityNotices.filter(
    (notice) => notice.createdAt >= sevenDaysAgo && notice.isActive && notice.isApproved
  );
}
