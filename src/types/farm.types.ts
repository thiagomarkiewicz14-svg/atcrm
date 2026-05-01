export interface Farm {
  id: string;
  user_id: string;
  client_id: string;
  name: string;
  city: string | null;
  state: string | null;
  total_area: number | null;
  main_crops: string[];
  current_season: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type FarmInsert = Pick<
  Farm,
  'client_id' | 'name' | 'city' | 'state' | 'total_area' | 'main_crops' | 'current_season' | 'notes'
>;

export type FarmUpdate = Partial<Omit<FarmInsert, 'client_id'>>;
