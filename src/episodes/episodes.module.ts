import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { diskStorage } from 'multer';
import { uploadDestination } from '../config/upload.config';
import { Episode } from './episode.entity';
import { EpisodeMapper } from './mapper/episode.mapper';
import { SettingsModule } from '../shared/settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Episode]),
    MulterModule.registerAsync({
      useFactory: async () => ({
        storage: diskStorage({
          destination: uploadDestination.episode,
          filename(
            req: Express.Request,
            file: Express.Multer.File,
            cb: (error: Error | null, filename: string) => void,
          ): void {
            cb(null, file.originalname);
          },
        }),
      }),
    }),
    SettingsModule,
  ],
  controllers: [EpisodesController],
  providers: [EpisodesService, EpisodeMapper],
  exports: [EpisodesService],
})
export class EpisodesModule {}
