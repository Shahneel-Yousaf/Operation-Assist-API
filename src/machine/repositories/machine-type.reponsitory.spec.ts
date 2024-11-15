import { MachineType } from '@machine/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { MachineTypeRepository } from './machine-type.repository';

describe('MachineTypeRepository', () => {
  let repository: MachineTypeRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MachineTypeRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = moduleRef.get<MachineTypeRepository>(MachineTypeRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('groupMachineSuggestions', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<MachineType>);

    const isoLocaleCode = 'ja';
    const result = await repository.getMachineTypes(isoLocaleCode);

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
