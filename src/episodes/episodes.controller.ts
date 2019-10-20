import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { Episode } from './episode.entity';

@Controller('episodes')
export class EpisodesController {
  constructor(private episodeService: EpisodesService) {}

  // @Get()
  // getAllEpisodes(): Episode[] {
  //   // return this.episodeService.getAllEpisodes();
  // }

  @Get('/:id')
  getEpisodeById(@Param('id', ParseIntPipe) id: number): Promise<Episode> {
    return this.episodeService.getEpisodeById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createEpisode(@Body() createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    return this.episodeService.createEpisode(createEpisodeDto);
  }
}
