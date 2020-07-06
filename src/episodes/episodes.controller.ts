import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { Episode } from './episode.entity';
import { EpisodeDuplicatedException } from './exceptions/episode-duplicated.exception';
import { SettingsNotFoundExceptionFilter } from '../settings/filters/settings-not-found-exception.filter';
import { EpisodeDuplicatedFilter } from './filters/episode-duplicated.filter';

@Controller('/api/episodes')
export class EpisodesController {
  public constructor(private episodeService: EpisodesService) {}

  @Get()
  public getEpisodes(): Promise<Episode[]> {
    return this.episodeService.getPublishedEpisode();
  }

  @Get('/highlight-episode')
  @UseFilters(new SettingsNotFoundExceptionFilter())
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
  @UseFilters(new EpisodeDuplicatedFilter())
  public async createEpisode(
    @Body() createEpisodeDto: CreateEpisodeDto,
  ): Promise<Episode> {
    return this.episodeService.createEpisode(createEpisodeDto);
  }
}
