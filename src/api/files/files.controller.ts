import { Controller, Get, Param, Res, ParseIntPipe, StreamableFile } from "@nestjs/common";
import { FilesService } from './files.service';
import { Readable } from 'stream';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':id')
  async getProductImagesById(@Res() response: Response, @Param('id', ParseIntPipe) id: number): Promise<StreamableFile> {
    const file = await this.filesService.getProductImgById(id);
    const stream = Readable.from(file.data);

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': 'image'
    })

    return new StreamableFile(stream);
  }
}
