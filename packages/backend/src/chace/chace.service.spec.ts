import { Test, TestingModule } from '@nestjs/testing';
import { ChaceService } from './chace.service';

describe('ChaceService', () => {
  let service: ChaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChaceService],
    }).compile();

    service = module.get<ChaceService>(ChaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
