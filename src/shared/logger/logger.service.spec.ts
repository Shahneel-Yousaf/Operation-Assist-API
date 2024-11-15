import { ConfigService } from '@nestjs/config';

import { AppLogger } from './logger.service';

describe('AppLogger', () => {
  it('should be defined', () => {
    expect(new AppLogger(new ConfigService())).toBeDefined();
  });
});
