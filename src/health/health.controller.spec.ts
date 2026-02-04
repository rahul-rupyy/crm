import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { expect } from 'chai';
describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: () => Promise.resolve({ status: 'ok' }),
          },
        },
        {
          provide: MongooseHealthIndicator,
          useValue: {
            pingCheck: () => Promise.resolve({ mongodb: { status: 'up' } }),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).to.not.equal(undefined);
  });
});
