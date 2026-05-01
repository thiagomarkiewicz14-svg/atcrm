export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  company_name: string | null;
  role: string | null;
  city: string | null;
  state: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type ProfileUpdate = Partial<
  Pick<Profile, 'full_name' | 'phone' | 'company_name' | 'role' | 'city' | 'state' | 'avatar_url'>
>;
