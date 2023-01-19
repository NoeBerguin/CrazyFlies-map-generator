import { Point } from './point';

export interface Drone {
  id: number;
  uri: string;
  point: Point;
  state: string;
  is_connected: boolean;
  battery: number;
  pos: number;
  yawn: number;
}
