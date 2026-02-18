
export interface Player {
  id: string;
  nickname: string;
}

export interface TeamRegistration {
  teamName: string;
  phone: string;
  players: Player[];
}

export type PopupType = 'loading' | 'success' | 'error' | null;

export interface PopupState {
  type: PopupType;
  message: string;
}

export interface Settings {
  registration_open: boolean;
}

export interface TeamData {
  id: string;
  team_name: string;
  phone: string;
  player1_id: string;
  player1_name: string;
  player2_id: string;
  player2_name: string;
  player3_id: string;
  player3_name: string;
  player4_id: string;
  player4_name: string;
  player5_id: string;
  player5_name: string;
  created_at: string;
}
