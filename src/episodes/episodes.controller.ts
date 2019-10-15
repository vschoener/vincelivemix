import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { Episode } from './episode';
import { CreateEpisodeDto } from './dto/create-episode.dto';

@Controller('episodes')
export class EpisodesController {
  constructor(private episodeService: EpisodesService) {}

  @Get()
  getAllEpisodes(): Episode[] {
    return this.episodeService.getAllEpisodes();
  }

  @Get('/:id')
  getEpisodeById(@Param('id') id: string): Episode {
    return this.episodeService.getEpisodeById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createEpisode(@Body() createEpisodeDto: CreateEpisodeDto): Episode {
    return this.episodeService.createEpisode(createEpisodeDto);
  }
}
