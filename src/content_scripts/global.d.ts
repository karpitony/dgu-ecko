import { VodLecture as ImportVodLecture} from './types';

declare global {
  type VodLecture = ImportVodLecture;
}

export {};