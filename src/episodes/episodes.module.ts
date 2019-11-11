import { Module } from '@nestjs/common';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { uploadDestination } from '../config/upload.config';
import { Episode } from './episode.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Episode,
    ]),
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
  ],
  controllers: [EpisodesController],
  providers: [EpisodesService],
})
export class EpisodesModule {}
