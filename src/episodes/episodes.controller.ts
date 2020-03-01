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
import { EpisodeDuplicated } from './exceptions/EpisodeDuplicated';

@Controller('episodes')
export class EpisodesController {
  constructor(
    private episodeService: EpisodesService,
  ) {}

  @Get('/:id')
  getEpisodeById(@Param('id', ParseIntPipe) id: number): Promise<Episode> {
    return this.episodeService.getEpisodeById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createEpisode(
    @Body() createEpisodeDto: CreateEpisodeDto,
  ): Promise<Episode> {
    try {
      return await this.episodeService.createEpisode(createEpisodeDto);
    } catch (err) {
      switch (err.constructor) {
        case EpisodeDuplicated:
          throw new BadRequestException(err.message);
          break;
      }

      throw err;
    }
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
