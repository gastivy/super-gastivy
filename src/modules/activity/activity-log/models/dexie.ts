export interface DataActivity {
  start_date: Date | undefined;
  end_date: Date | undefined;
  is_done: boolean;
  description: string;
}

export interface ActivitiesDexieStore {
  id: string;
  name: string;
  data: DataActivity[];
}
