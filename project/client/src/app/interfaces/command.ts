export interface Command {
  action: Action;
  arg: any;
}

export enum Action {
  Start = 5,
  Stop = 6,
  Scan = 2,
  returnToBase = 3,
  Identify = 4,
  StartDrone = 5,
  StopDrone = 6,
  NewMission = 7,
  MissionHistory = 8,
  DeleteMission = 9,
  ChangeMissionMode = 10,
  ConnectDrone = 11,
}
