import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { Episode } from './episode.entity';
import { EpisodeDuplicated } from './exceptions/EpisodeDuplicated';
import { EpisodeSettingsDto } from './dto/episode-settings.dto';

@Controller('/api/episodes')
export class EpisodesController {
  public constructor(private episodeService: EpisodesService) {}

  @Get()
  public getEpisodes(): Promise<Episode[]> {
    return this.episodeService.getPublishedEpisode();
  }

  @Get('/highlight-episode')
  public getHighlightEpisode(): Promise<Episode | null> {
    return this.episodeService.getHighLightEpisode();
  }

  @Get('/:id')
  public getEpisodeById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Episode> {
    return this.episodeService.getEpisodeById(id);
  }

  @Put('/settings')
  @UsePipes(ValidationPipe)
  public updateOrCreateSettings(@Body() payload: EpisodeSettingsDto) {
    return this.episodeService.createOrUpdateEpisodeSettings(payload);
  }

  @Post()
  @UsePipes(ValidationPipe)
  public async createEpisode(
    @Body() createEpisodeDto: CreateEpisodeDto,
  ): Promise<Episode> {
    try {
      return await this.episodeService.createEpisode(createEpisodeDto);
    } catch (err) {
      switch (err.constructor) {
        case EpisodeDuplicated:
          throw new BadRequestException(err.message);
      }

      throw err;
    }
  }

  @Post('/:id/cover_image')
  @UseInterceptors(FileInterceptor('coverImage'))
  public uploadCoverImage(
    @Param('id') id: number,
    @UploadedFile() coverImage: Express.Multer.File,
  ) {
    if (!coverImage) {
      throw new BadRequestException('coverImage file is missing');
    }

    return this.episodeService.storeImage(id, coverImage);
  }
}
