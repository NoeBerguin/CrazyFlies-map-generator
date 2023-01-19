import { Point } from './point';

export interface Mission {
  id: number;
  name: string;
  date: string;
  time: string;
  type: string;
  totalDistance: number;
  nbDrones: number;
  logs: string;
  map: string[];
}
