import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { GraphAPIService } from '@graph-api/services/graph-api.service';
import { GroupQuery } from '@group/dtos';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeviceCurrentStatus,
  ErrorType,
  EventType,
  MAX_ATTEMPTS,
  UserCurrentStatus,
  UserGroupAssignmentCurrentStatus,
  UserGroupAssignmentHistoryEventType,
} from '@shared/constants';
import { CommonRequest } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { generateRandomSearchId } from '@shared/utils/commons';
import {
  GetUserSettingOutput,
  RegisterUserInput,
  UpdateUserDeviceInput,
  UpdateUserDeviceOutput,
  UpdateUserProfileInput,
  UpdateUserSettingInput,
  UpdateUserSettingOutput,
  UserOutput,
  UserPermissionsOutput,
} from '@user/dtos';
import {
  Device,
  User,
  UserCiamLink,
  UserGroupAssignment,
  UserGroupAssignmentHistory,
  UserHistory,
  UserSetting,
} from '@user/entities';
import {
  UserGroupAssignmentRepository,
  UserRepository,
  UserSettingRepository,
} from '@user/repositories';
import { plainToInstance } from 'class-transformer';
import * as dayjs from 'dayjs';
import { I18nService } from 'nestjs-i18n';
import { DataSource, Not } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly userGroupAssignmentRepository: UserGroupAssignmentRepository,
    private readonly userSettingRepository: UserSettingRepository,
    private readonly dataSource: DataSource,
    private readonly logger: AppLogger,
    private readonly configService: ConfigService,
    private readonly storageService: BlobStorageService,
    private readonly i18n: I18nService,
    private readonly graphAPIService: GraphAPIService,
  ) {
    this.logger.setContext(UserService.name);
  }

  async getMyProfile(
    ctx: RequestContext,
    req: CommonRequest,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.getMyProfile.name} was called`);

    this.logger.log(ctx, `calling ${UserRepository.name}.getUserProfile`);
    const isoLocaleCode = req.headers['x-lang'];
    const { oid, iss } = ctx.userCiamLink;
    const user = await this.repository.getUserProfile(oid, iss);
    if (!user) {
      throw new NotFoundException({
        message: 'User not exist.',
        errorType: ErrorType.USER_NOT_FOUND,
      });
    }

    if (user.currentStatus === UserCurrentStatus.DELETED) {
      throw new UnauthorizedException({
        message: 'User has been deleted.',
        errorType: ErrorType.USER_NOT_FOUND,
        customMessage: this.i18n.t('message.user.existingDelete', {
          lang: isoLocaleCode,
        }),
        isDeleted: true,
      });
    }

    user.pictureUrl = this.storageService.generateSasUrl(user.pictureUrl);

    return plainToInstance(UserOutput, {
      ...user,
      suppressDataUsagePopup: user.userSetting.suppressDataUsagePopup,
    });
  }

  //The user that does not exist will proceed with registration
  async registerUser(
    ctx: RequestContext,
    registerUserInput: RegisterUserInput,
    language: string,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.registerUser.name} was called`);

    const { oid, iss, emails } = ctx.userCiamLink;

    //Check user already exists
    const existUser = await this.repository.getUserByCiam(oid, iss);
    if (existUser) {
      throw new BadRequestException('This user is already in use.');
    }

    const user = await this.repository.findOne({
      where: {
        email: registerUserInput.email,
      },
    });
    if (user) {
      throw new BadRequestException({
        message: 'This email address is already in use.',
        customMessage: this.i18n.t('message.group.emailAlreadyInUse', {
          lang: language || registerUserInput.isoLocaleCode,
        }),
      });
    }

    let searchId;
    let attempts;
    for (attempts = 0; attempts < MAX_ATTEMPTS; attempts++) {
      searchId = generateRandomSearchId();
      this.logger.log(
        ctx,
        `Generate in attempt: ${attempts}, searchId: ${searchId}`,
      );
      const existingUser = await this.repository.findOne({
        where: { searchId },
      });
      if (!existingUser) break;
    }
    // Check generate a unique search_id over 100 attempts
    if (attempts === MAX_ATTEMPTS) {
      throw new BadRequestException(
        'Failed to generate a unique search_id over 100 attempts',
      );
    }

    const timeNow = new Date();
    const newUser = await this.dataSource.transaction(async (tx) => {
      const userRepo = tx.getRepository(User);
      const userCiamLinkRepo = tx.getRepository(UserCiamLink);
      const userSettingRepo = tx.getRepository(UserSetting);
      const userHistoryRepo = tx.getRepository(UserHistory);

      const user = await userRepo.save(
        userRepo.create({
          ...registerUserInput,
          searchId: searchId,
          registeredAt: timeNow,
          currentStatus: UserCurrentStatus.CREATED,
          lastStatusUpdatedAt: timeNow,
        }),
      );

      await userCiamLinkRepo.insert({
        userId: user.userId,
        oid,
        iss,
        linkedAt: timeNow,
        ciamEmail: emails[0],
      });

      await userSettingRepo.insert({
        userId: user.userId,
      });

      await userHistoryRepo.insert({
        eventAt: timeNow,
        eventType: EventType.CREATE,
        actionedByUserId: user.userId,
        userId: user.userId,
        currentStatus: UserCurrentStatus.CREATED,
        ...registerUserInput,
      });

      return user;
    });

    return plainToInstance(UserOutput, {
      ...newUser,
      pictureUrl: this.storageService.generateSasUrl(newUser.pictureUrl),
    });
  }

  async updateUserProfile(
    ctx: RequestContext,
    input: UpdateUserProfileInput,
  ): Promise<UserOutput> {
    this.logger.log(ctx, `${this.updateUserProfile.name} was called`);
    if (input.email) {
      const userByMail = await this.repository.findOne({
        where: {
          email: input.email,
          userId: Not(ctx.user.userId),
        },
      });
      if (userByMail) {
        throw new BadRequestException({
          message: 'This email address is already in use.',
          customMessage: this.i18n.t('message.group.emailAlreadyInUse', {
            lang: ctx.isoLocaleCode,
          }),
        });
      }
    }
    const user = ctx.user;
    const userId = user.userId;
    const timeNow = new Date();
    await this.dataSource.transaction(async (tx) => {
      const userRepo = tx.getRepository(User);
      const userHistoryRepo = tx.getRepository(UserHistory);

      await userRepo.save(
        userRepo.create({
          ...input,
          currentStatus: UserCurrentStatus.UPDATED,
          lastStatusUpdatedAt: timeNow,
          userId,
        }),
      );

      await userHistoryRepo.save(
        userHistoryRepo.create({
          ...user,
          eventAt: timeNow,
          eventType: EventType.UPDATE,
          actionedByUserId: userId,
          userId,
          email: user.email,
          currentStatus: UserCurrentStatus.UPDATED,
          ...input,
        }),
      );
    });

    const respUser = { ...user, ...input };
    return plainToInstance(UserOutput, {
      ...respUser,
      pictureUrl: this.storageService.generateSasUrl(respUser.pictureUrl),
    });
  }

  async getUserPermissions(
    ctx: RequestContext,
    query: GroupQuery,
  ): Promise<UserPermissionsOutput> {
    this.logger.log(ctx, `${this.getUserPermissions.name} was called`);

    const userId = ctx.user.userId;
    const groupId = query.groupId;
    const groupPermissions =
      await this.userGroupAssignmentRepository.getUserPermissions(
        userId,
        groupId,
      );

    if (groupId && !groupPermissions.length) {
      throw new ForbiddenException(
        'You do not have permission to access this group.',
      );
    }

    const groups = groupPermissions.map((group) => ({
      groupId: group.groupId,
      permissions: group.userGroupPermissionAssignments.reduce(
        (acc, permissionAssignment) => {
          acc[permissionAssignment.permission.resource.resourceCode] =
            permissionAssignment.permission.operation.operationCode;
          return acc;
        },
        {},
      ),
    }));

    return plainToInstance(UserPermissionsOutput, {
      userId,
      groups,
      exp: dayjs()
        .add(this.configService.get<number>('permissionTokenDuration'), 'hours')
        .unix(),
    });
  }

  async getUserSetting(ctx: RequestContext): Promise<GetUserSettingOutput> {
    this.logger.log(ctx, `${this.getUserSetting.name} was called`);

    const user = await this.userSettingRepository.findOne({
      where: {
        userId: ctx.user.userId,
      },
    });

    return plainToInstance(GetUserSettingOutput, user);
  }

  async updateUserSetting(
    ctx: RequestContext,
    input: UpdateUserSettingInput,
  ): Promise<UpdateUserSettingOutput> {
    this.logger.log(ctx, `${this.updateUserSetting.name} was called`);
    const userId = ctx.user.userId;

    await this.userSettingRepository.update(userId, {
      ...input,
      userId,
    });

    return plainToInstance(UpdateUserSettingOutput, input);
  }

  async updateUserDevice(
    ctx: RequestContext,
    input: UpdateUserDeviceInput,
  ): Promise<UpdateUserDeviceOutput> {
    this.logger.log(ctx, `${this.updateUserDevice.name} was called`);
    const userId = ctx.user.userId;
    const timeNow = new Date();

    const updatedDevice = await this.dataSource.transaction(async (tx) => {
      // Remove duplicate fcm token
      const deviceRepo = tx.getRepository(Device);
      await deviceRepo.update(
        {
          fcmToken: input.fcmToken,
          userId: Not(userId),
        },
        {
          currentStatus: DeviceCurrentStatus.DELETED,
          lastStatusUpdatedAt: timeNow,
        },
      );

      // Get device fcm token of current user
      const userDevice = await deviceRepo.findOne({
        where: { userId, currentStatus: Not(DeviceCurrentStatus.DELETED) },
      });

      return deviceRepo.save(
        deviceRepo.create({
          ...input,
          userId,
          deviceId: userDevice?.deviceId,
          lastActiveAt: timeNow,
          currentStatus: userDevice
            ? DeviceCurrentStatus.UPDATED
            : DeviceCurrentStatus.CREATED,
          lastStatusUpdatedAt: timeNow,
        }),
      );
    });

    return plainToInstance(UpdateUserDeviceOutput, updatedDevice);
  }

  async deleteUser(ctx: RequestContext) {
    this.logger.log(ctx, `${this.deleteUser.name} was called`);
    const {
      user: { userId, email },
      userCiamLink: { oid },
    } = ctx;
    await this.dataSource.transaction(async (tx) => {
      const timeNow = new Date();
      const timestampUnix = dayjs().unix();
      const userRepo = tx.getRepository(User);
      const userHistoryRepo = tx.getRepository(UserHistory);
      const userGroupAssignmentRepo = tx.getRepository(UserGroupAssignment);
      const userGroupAssignmentHistoryRepo = tx.getRepository(
        UserGroupAssignmentHistory,
      );
      const userCiamLinkRepo = tx.getRepository(UserCiamLink);

      const userData = userRepo.create({
        currentStatus: UserCurrentStatus.DELETED,
        lastStatusUpdatedAt: timeNow,
        email: `${email}_deleted_at_${timestampUnix}`,
        pictureUrl: null,
        surname: this.i18n.t('message.user.deletedUser.surname', {
          lang: ctx.isoLocaleCode,
        }),
        givenName: this.i18n.t('message.user.deletedUser.givenName', {
          lang: ctx.isoLocaleCode,
        }),
      });
      await userRepo.update(userId, userData);

      await userCiamLinkRepo.update(
        { userId },
        {
          ciamEmail: `${email}_deleted_at_${timestampUnix}`,
          linkedAt: timeNow,
        },
      );

      await userHistoryRepo.insert(
        userHistoryRepo.create({
          ...ctx.user,
          ...userData,
          eventAt: timeNow,
          eventType: EventType.DELETE,
          actionedByUserId: userId,
        }),
      );
      const userGroupAssignments = await userGroupAssignmentRepo.find({
        where: { userId },
      });

      await userGroupAssignmentRepo.update(
        { userId },
        {
          lastStatusUpdatedAt: timeNow,
          currentStatus: UserGroupAssignmentCurrentStatus.UNASSIGNED,
        },
      );

      await userGroupAssignmentHistoryRepo.insert(
        userGroupAssignments.map((userGroupAssignment) => ({
          ...userGroupAssignment,
          eventType: UserGroupAssignmentHistoryEventType.UNASSIGNED,
          eventAt: timeNow,
          actionedByUserId: userId,
        })),
      );

      await this.graphAPIService.deleteB2CUser(ctx, oid);
    });

    return { data: {}, meta: {} };
  }
}
