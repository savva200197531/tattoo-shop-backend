import { ExpressMulterFile } from '@/api/types/file';

export type CreateProduct = {
  name: string;
  price: number;
  count: number;
  images?: ExpressMulterFile[];
};

export type UpdateProduct = Partial<CreateProduct> & {
  img_ids?: number[];
};
