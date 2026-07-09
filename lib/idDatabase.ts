import { UniversalIdRecord } from '../types';

const ACTIVE_USER_ID_KEY = 'ugt_supabase_active_user_id';
const LOCAL_USERS_KEY = 'ugt_local_users';

// Mock Planetary citizens to seed our local sandbox so that ranks calculate realistically
const MOCK_CITIZENS = [
  {
    id: "UGT-000001",
    name: "Aria Thorne",
    dob: "1994-04-12",
    email: "aria@galaxy.net",
    phone: "9876543210",
    pincode: "560001",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    nation: "India",
    order_num: 1,
    registered_at: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "UGT-000002",
    name: "Kaelen Voss",
    dob: "1988-11-23",
    email: "kaelen@voss.io",
    phone: "1234567891",
    pincode: "10001",
    city: "New York",
    district: "New York County",
    state: "New York",
    nation: "United States",
    order_num: 2,
    registered_at: "2026-07-02T14:30:00.000Z"
  },
  {
    id: "UGT-000003",
    name: "Zoya Patel",
    dob: "1991-07-05",
    email: "zoya@design.com",
    phone: "9123456780",
    pincode: "560001",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    nation: "India",
    order_num: 3,
    registered_at: "2026-07-03T10:15:00.000Z"
  },
  {
    id: "UGT-000004",
    name: "Marcus Aurelius",
    dob: "1975-04-26",
    email: "marcus@philosophy.org",
    phone: "1112223334",
    pincode: "00100",
    city: "Rome",
    district: "Rome",
    state: "Lazio",
    nation: "Italy",
    order_num: 4,
    registered_at: "2026-07-04T18:45:00.000Z"
  }
];

// Helper to check if sandbox mode is active (now permanently true to restrict browser database/API usage)
export const isSandboxEnabled = (): boolean => {
  return true;
};

export const setSandboxEnabled = (enabled: boolean) => {
  // No-op to preserve interface compatibility
};

// Retrieve local sandbox users
export function getLocalUsers(): any[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LOCAL_USERS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(MOCK_CITIZENS));
    return MOCK_CITIZENS;
  }
  return JSON.parse(stored);
}

// Save local sandbox users
function saveLocalUsers(users: any[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

// Local Rank calculator
function calculateRanksLocal(user: any, allUsers: any[]): UniversalIdRecord {
  const orderNum = user.order_num;
  const filterByOrder = (u: any) => u.order_num <= orderNum;

  const matchStr = (a: string, b: string) => (a || '').trim().toLowerCase() === (b || '').trim().toLowerCase();

  const universeCount = allUsers.filter(filterByOrder).length;
  const nationCount = allUsers.filter(u => filterByOrder(u) && matchStr(u.nation, user.nation)).length;
  const stateCount = allUsers.filter(u => filterByOrder(u) && matchStr(u.nation, user.nation) && matchStr(u.state, user.state)).length;
  const districtCount = allUsers.filter(u => filterByOrder(u) && matchStr(u.state, user.state) && matchStr(u.district, user.district)).length;
  const cityCount = allUsers.filter(u => filterByOrder(u) && matchStr(u.state, user.state) && matchStr(u.city, user.city)).length;
  const pincodeCount = allUsers.filter(u => filterByOrder(u) && matchStr(u.pincode, user.pincode)).length;

  return {
    id: user.id,
    name: user.name,
    dob: user.dob,
    email: user.email,
    phone: user.phone,
    pincode: user.pincode,
    city: user.city,
    district: user.district,
    state: user.state,
    nation: user.nation,
    registeredAt: user.registered_at,
    order: orderNum,
    universeRank: universeCount,
    nationRank: nationCount || 1,
    stateRank: stateCount || 1,
    districtRank: districtCount || 1,
    cityRank: cityCount || 1,
    pincodeRank: pincodeCount || 1,
  };
}

// Fetch the total count of users registered
export const getSupabaseUserCount = async (): Promise<number> => {
  return getLocalUsers().length;
};

// Register a new user
export const registerUserInSupabase = async (data: {
  name: string;
  dob: string;
  email: string;
  phone: string;
  pincode: string;
  city: string;
  district: string;
  state: string;
  nation: string;
}): Promise<UniversalIdRecord> => {
  const users = getLocalUsers();
  const existing = users.find(u => u.email.trim().toLowerCase() === data.email.trim().toLowerCase());
  if (existing) {
    throw new Error('This email is already associated with a Universal ID.');
  }
  const nextOrderNum = users.length > 0 
    ? Math.max(...users.map(u => u.order_num)) + 1 
    : 1;
  const formattedId = `UGT-${String(nextOrderNum).padStart(6, '0')}`;
  const newUser = {
    id: formattedId,
    name: data.name.trim(),
    dob: data.dob,
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    pincode: data.pincode.trim(),
    city: data.city.trim(),
    district: data.district.trim(),
    state: data.state.trim(),
    nation: data.nation.trim(),
    order_num: nextOrderNum,
    registered_at: new Date().toISOString()
  };
  users.push(newUser);
  saveLocalUsers(users);
  setActiveSupabaseUserId(newUser.id);
  return calculateRanksLocal(newUser, users);
};

// Login user with ID or Email
export const loginUserInSupabase = async (identifier: string): Promise<UniversalIdRecord> => {
  const users = getLocalUsers();
  const cleanId = identifier.trim().toLowerCase();
  const user = users.find(u => u.id.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId);
  if (!user) {
    throw new Error('Universal ID or Email not found. Please register first.');
  }
  setActiveSupabaseUserId(user.id);
  return calculateRanksLocal(user, users);
};

// Retrieve active user from localStorage and fetch live details
export const getActiveSupabaseUser = async (): Promise<UniversalIdRecord | null> => {
  if (typeof window === 'undefined') return null;
  const activeId = localStorage.getItem(ACTIVE_USER_ID_KEY);
  if (!activeId) return null;

  const users = getLocalUsers();
  const user = users.find(u => u.id === activeId);
  if (!user) return null;
  return calculateRanksLocal(user, users);
};

// Set active user in localStorage
export const setActiveSupabaseUserId = (id: string | null) => {
  if (typeof window === 'undefined') return;
  if (id === null) {
    localStorage.removeItem(ACTIVE_USER_ID_KEY);
  } else {
    localStorage.setItem(ACTIVE_USER_ID_KEY, id);
  }
};
