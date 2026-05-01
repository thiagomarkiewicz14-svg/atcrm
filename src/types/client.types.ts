export type ClientStatus = 'prospect' | 'active' | 'inactive' | 'lost';

export type CommercialPotential = 'low' | 'medium' | 'high';

export interface Client {
  id: string;
  user_id: string;
  name: string;
  document: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  city: string | null;
  state: string | null;
  farm_name: string | null;
  total_area: number | null;
  main_crops: string[];
  current_season: string | null;
  status: ClientStatus;
  commercial_potential: CommercialPotential;
  origin: string | null;
  tags: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type ClientInsert = Pick<
  Client,
  | 'name'
  | 'document'
  | 'phone'
  | 'whatsapp'
  | 'email'
  | 'city'
  | 'state'
  | 'farm_name'
  | 'total_area'
  | 'main_crops'
  | 'current_season'
  | 'status'
  | 'commercial_potential'
  | 'origin'
  | 'tags'
  | 'notes'
>;

export type ClientUpdate = Partial<ClientInsert>;

export interface ClientFilters {
  search?: string;
  status?: ClientStatus | 'all';
  commercialPotential?: CommercialPotential | 'all';
  limit?: number;
}

export interface ClientStats {
  total: number;
  prospects: number;
  active: number;
  highPotential: number;
}
