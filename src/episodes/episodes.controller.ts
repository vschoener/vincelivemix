import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { Episode } from './episode.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('episodes')
export class EpisodesController {
  constructor(private episodeService: EpisodesService) {}

  @Get('/:id')
  getEpisodeById(@Param('id', ParseIntPipe) id: number): Promise<Episode> {
    return this.episodeService.getEpisodeById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createEpisode(@Body() createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    return this.episodeService.createEpisode(createEpisodeDto);
  }

  @Post('/:id/cover_image')
  @UseInterceptors(FileInterceptor('coverImage'))
  uploadCoverImage(
    @Param('id') id: number,
    @UploadedFile() coverImage: Express.Multer.File,
  ) {
    if (!coverImage) {
      throw new BadRequestException('coverImage file is missing');
    }

    return this.episodeService.storeImage(id, coverImage);
  }
}
