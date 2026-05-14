export interface DataActivity {
  start_date: Date | undefined;
  end_date: Date | undefined;
  is_done: boolean;
  description: string;
}

export type TimerType = "stopwatch" | "pomodoro";

export interface ActivitiesDexieStore {
  id: string;
  name: string;
  data: DataActivity[];
  timer_type?: TimerType;
  pomodoro_duration?: number; // in seconds
}
