import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { Episode } from './episode.entity';
import { EpisodeDuplicated } from './exceptions/EpisodeDuplicated';

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

  @Post()
  @UsePipes(ValidationPipe)
  public async createEpisode(
    @Body() createEpisodeDto: CreateEpisodeDto,
  ): Promise<Episode> {
    try {
      return this.episodeService.createEpisode(createEpisodeDto);
    } catch (err) {
      switch (err.constructor) {
        case EpisodeDuplicated:
          throw new BadRequestException(err.message);
      }

      throw err;
    }
  }
}
