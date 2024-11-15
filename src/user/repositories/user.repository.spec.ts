import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@user/entities';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('getUserDevicesInGroup', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        innerJoin: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<User>);
    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    const userId = 'userAE2D3DE0SAVCGDC8DMP74E';

    const result = await repository.getUserDevicesInGroup(groupId, userId);

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('getUserProfile', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce({}),
      } as unknown as SelectQueryBuilder<User>);
    const oid = 'string';
    const iss = 'string';

    const result = await repository.getUserProfile(oid, iss);

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual({});
  });
});
