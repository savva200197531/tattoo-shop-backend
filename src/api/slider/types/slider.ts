import { ExpressMulterFile } from '@/api/types/file';

export type CreateSlide = {
  title: string;
  description: string;
  bg_color: string;
  img?: ExpressMulterFile;
};

export type UpdateSlide = Partial<CreateSlide> & {
  img_id?: number;
};
