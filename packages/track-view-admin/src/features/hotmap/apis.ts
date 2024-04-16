import axios from 'axios';
import { Response } from 'src/app';

export interface Event {
  type: string;
  userId: string;
  userName?: string;
  metaData?: object;
}

export const fetchClickEvents = (): Promise<
  Response<{ id: string; attributes: Event }[]>
> => axios.get(`/events?filters[type][$eq]=Click`);
