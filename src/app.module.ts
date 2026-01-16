import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // 10 requests per minute 
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),],
  controllers: [AppController],
  providers: [AppService,
{
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

  ],
})
export class AppModule {}
