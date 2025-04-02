import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressResolver } from './progress.resolver';

@Module({
  providers: [ProgressService, ProgressResolver]
})
export class ProgressModule {}
