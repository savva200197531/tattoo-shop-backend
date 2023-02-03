import {
  Controller,
  Get,
  Param,
  Res,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product-img/:id')
  async getProductImgById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.filesService.getProductImgById(id);

    const stream = createReadStream(join(process.cwd(), file.path));

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': file.mimetype,
    });

    return new StreamableFile(stream);
  }
}
