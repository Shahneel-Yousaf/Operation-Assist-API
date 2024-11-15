import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { FirebaseService } from '@firebase/services/firebase.service';
import {
  GetMachineReportsOutput,
  GroupMachineParam,
  GroupMachineReportParam,
  MachineHistoriesOutput,
  MachineReportInput,
  MachineReportOutput,
  MachineReportResponseInput,
  PaginationInputQuery,
} from '@group/dtos';
import { Group } from '@group/entities';
import { GroupService } from '@group/services/group.service';
import {
  GetMachineReportDetailOutput,
  GetMachineReportResponsesOutput,
  MachineReportResponseOutput,
} from '@machine/dtos';
import { Machine } from '@machine/entities';
import {
  FuelMaintenanceReportInput,
  GetFuelMaintenanceReportDetailOutput,
  GetMachineOperationReportDetailOutput,
  GetMachineReportsForWebappOutput,
  GetMachineReportsForWebappQuery,
  GetMachineSummaryOutput,
  GetMachineSummaryQuery,
  GetMaintenanceReportDetailOutput,
  GetReportFilterCountOutput,
  GetReportFilterCountQuery,
  MachineOperationReportInput,
  MaintenanceReportInput,
  ReportActionOutput,
  SyncMachineReportInput,
  SyncMachineReportOutput,
} from '@machine-report/dtos';
import {
  FuelMaintenanceReport,
  FuelRefill,
  MachineOperationReport,
  MachineReport,
  MachineReportHistory,
  MachineReportMedia,
  MachineReportResponse,
  MachineReportUserRead,
  MaintenanceReport,
  MaintenanceReportIrregularMaintenanceItem,
  OilCoolantRefillExchange,
  PartReplacement,
  PartReplacementMedia,
} from '@machine-report/entities';
import {
  MachineReportHistoryRepository,
  MachineReportRepository,
  MachineReportUserReadRepository,
} from '@machine-report/repositories';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  dateFormat,
  EventType,
  GroupCurrentStatus,
  InspectionFormHistoryCurrentStatus,
  ISOLocaleCode,
  MachineCurrentStatus,
  MachineHistoryType,
  MachineReportCurrentStatus,
  MachineReportResponseStatus,
  MachineReportType,
  MachineSummaryType,
  MaintenanceReasonChoiceCode,
  NotificationContentCode,
  NotificationType,
  StatusName,
  Subtype,
  Version,
  VIDEO_MIME_TYPE,
} from '@shared/constants';
import { BaseApiResponse, UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import {
  convertTimezoneToUTC,
  formatServiceMeter,
  groupDeviceUsersByLocaleCode,
  isNil,
} from '@shared/utils/commons';
import { ReportAction } from '@template/entities';
import {
  IrregularMaintenanceItemChoiceRepository,
  MaintenanceReasonChoiceRepository,
  MaintenanceReasonPeriodChoiceRepository,
  RegularMaintenanceItemChoiceRepository,
  ReportActionChoiceRepository,
} from '@template/repositories';
import { UserRepository } from '@user/repositories';
import { plainToInstance } from 'class-transformer';
import * as dayjs from 'dayjs';
import { I18nService } from 'nestjs-i18n';
import { DataSource, In } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class MachineReportService {
  constructor(
    private readonly machineReportRepository: MachineReportRepository,
    private readonly machineReportUserReadRepository: MachineReportUserReadRepository,
    private readonly machineReportHistoryRepository: MachineReportHistoryRepository,
    private readonly reportActionChoiceRepository: ReportActionChoiceRepository,
    private readonly irregularMaintenanceItemChoiceRepository: IrregularMaintenanceItemChoiceRepository,
    private readonly regularMaintenanceItemChoiceRepository: RegularMaintenanceItemChoiceRepository,
    private readonly maintenanceReasonPeriodChoiceRepository: MaintenanceReasonPeriodChoiceRepository,
    private readonly maintenanceReasonChoiceRepository: MaintenanceReasonChoiceRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
    private readonly logger: AppLogger,
    private readonly i18n: I18nService,
    private readonly storageService: BlobStorageService,
    private readonly firebaseService: FirebaseService,
  ) {
    this.logger.setContext(GroupService.name);
  }

  async getMachineHistories(
    ctx: RequestContext,
    params: GroupMachineParam,
    query: PaginationInputQuery,
    version?: string,
  ): Promise<BaseApiResponse<MachineHistoriesOutput[]>> {
    this.logger.log(ctx, `${this.getMachineHistories.name} was called`);

    const user = ctx.user;
    user.isoLocaleCode = ctx.isoLocaleCode;
    const { machineId } = params;
    const { limit } = query;
    const page = query.page || 1;
    const firstRequestTime = query.firstRequestTime || new Date();
    const offset = (page - 1) * limit;

    const machineHistories =
      await this.machineReportHistoryRepository.getListMachineHistories(
        machineId,
        limit + 1,
        offset,
        dayjs(firstRequestTime).format(dateFormat.dateTimeFormat),
        version,
      );

    const isNextPage = machineHistories.length > limit;

    const result = machineHistories.map((item) => ({
      ...item,
      machineHistoryType:
        item.subtype === Subtype.MAINTENANCE_REPORTS
          ? MachineHistoryType.MAINTENANCE_REPORTS
          : item.machineHistoryType,
      updateContent: this.handleUpdateContent(item, user, version),
    }));

    return {
      meta: {
        pageInfo: {
          nextPage: isNextPage,
          limit,
          page,
          firstRequestTime,
        },
      },
      data: plainToInstance(
        MachineHistoriesOutput,
        isNextPage ? result.slice(0, -1) : result,
      ),
    };
  }

  handleUpdateContent(item, user: UserAccessTokenClaims, version?: string) {
    let messageTypeKey;
    const {
      machineHistoryType,
      currentStatus,
      status,
      givenName,
      surname,
      inspectionFormName,
      subtype,
    } = item;
    const { UPDATED } = MachineReportCurrentStatus;
    const { UNADDRESSED, RESOLVED } = MachineReportResponseStatus;
    const { UPDATED: formUpdated, DELETED: formDeleted } =
      InspectionFormHistoryCurrentStatus;
    const versionPostfix =
      version === Version.V1 ? Version.V1.toUpperCase() : '';

    switch (machineHistoryType) {
      case MachineHistoryType.MACHINE_REPORTS:
        messageTypeKey = `message.machineReport${versionPostfix}.report`;
        if (currentStatus === UPDATED && status === UNADDRESSED) {
          messageTypeKey = `message.machineReport${versionPostfix}.update`;
        }

        if (currentStatus === UPDATED && status === RESOLVED) {
          messageTypeKey = `message.machineReport${versionPostfix}.resolve`;
        }

        if (subtype === Subtype.MAINTENANCE_REPORTS) {
          messageTypeKey = 'message.maintenanceReport.report';
        }
        break;
      case MachineHistoryType.INSPECTIONS:
        messageTypeKey = `message.inspection.inspectionResultHistory${versionPostfix}.register`;
        break;
      default:
        messageTypeKey = `message.inspectionForm.inspectionItemHistory${versionPostfix}.create`;
        if (currentStatus === formUpdated) {
          messageTypeKey = `message.inspectionForm.inspectionItemHistory${versionPostfix}.update`;
        } else if (currentStatus === formDeleted) {
          messageTypeKey = `message.inspectionForm.inspectionItemHistory${versionPostfix}.delete`;
        }
        break;
    }

    return this.i18n.t(messageTypeKey, {
      lang: user.isoLocaleCode,
      args: { surname, givenName, inspectionFormName },
    });
  }

  async getListMachineReport(
    ctx: RequestContext,
    params: GroupMachineParam,
    query: PaginationInputQuery,
  ): Promise<BaseApiResponse<GetMachineReportsOutput[]>> {
    this.logger.log(ctx, `${this.getListMachineReport.name} was called`);

    const { machineId } = params;
    const { limit, page } = query;
    const firstRequestTime = query.firstRequestTime || new Date();
    const offset = (page - 1) * limit;

    let machineReports =
      await this.machineReportRepository.getListMachineReport(
        machineId,
        ctx.user.userId,
        limit + 1,
        offset,
        dayjs(firstRequestTime).format(dateFormat.dateTimeFormat),
      );

    const isNextPage = machineReports.length > limit;

    machineReports = isNextPage ? machineReports.slice(0, -1) : machineReports;

    const timeNow = new Date();

    return {
      meta: {
        pageInfo: { nextPage: isNextPage, limit, page, firstRequestTime },
      },
      data: plainToInstance(
        GetMachineReportsOutput,
        machineReports.map((machineReport) => ({
          ...machineReport,
          filePath: machineReport.userPictureUrl ?? '',
          userPictureUrl: this.storageService.generateSasUrl(
            machineReport.userPictureUrl,
          ),
          reportType: machineReport.reportType
            ? MachineReportType.INSPECTION
            : MachineReportType.MACHINE,
          isRead: !!machineReport.isRead,
          timeSinceCommentCreation: this.creationTimeDuration(
            ctx.isoLocaleCode,
            machineReport.reportedAt,
            timeNow,
          ),
        })),
      ),
    };
  }

  async updateMachineReportReadStatus(
    ctx: RequestContext,
    params: GroupMachineReportParam,
  ) {
    this.logger.log(
      ctx,
      `${this.updateMachineReportReadStatus.name} was called`,
    );

    const userId = ctx.user.userId;
    const { machineReportId } = params;

    const machineReportUserRead =
      await this.machineReportUserReadRepository.findOne({
        where: {
          userId: userId,
          machineReportId: machineReportId,
        },
      });

    // Create machine report user reads
    if (!machineReportUserRead) {
      await this.machineReportUserReadRepository.insert(
        this.machineReportUserReadRepository.create({
          userId: userId,
          machineReportId: machineReportId,
          readAt: new Date(),
        }),
      );
    }

    return { data: {}, meta: {} };
  }

  async getMachineReportResponses(
    ctx: RequestContext,
    params: GroupMachineReportParam,
  ): Promise<GetMachineReportResponsesOutput> {
    this.logger.log(ctx, `${this.getMachineReportResponses.name} was called`);

    const { machineReportId } = params;

    const machineReport =
      await this.machineReportRepository.getMachineReportDetail(
        machineReportId,
        ctx.user.userId,
        ctx.isoLocaleCode,
      );

    const firstReportResponse = machineReport.machineReportResponses[0];
    const lastReportResponse =
      machineReport.machineReportResponses.slice(-1)[0];
    const machineReportResponses = machineReport.machineReportResponses.map(
      (response, index, array) => ({
        ...response,
        ...response.user,
        isChangeStatus: index
          ? array[index - 1].status !== response.status
          : false,
        userPictureUrl: this.storageService.generateSasUrl(
          response.user.pictureUrl,
        ),
        timeSinceCommentCreation: this.creationTimeDuration(
          ctx.isoLocaleCode,
          response.commentedAt,
        ),
        reportResponseStatus: response.status,
        subtype: response.subtype,
        reportActionChoices: response.reportActions.map((action) => ({
          ...action.reportActionChoice.reportActionChoiceTranslation,
          reportActionChoiceId: action.reportActionChoiceId,
          reportActionChoiceCode:
            action.reportActionChoice.reportActionChoiceCode,
        })),
        machineReportMedias: response.machineReportMedias.map(
          (machineReportMedia) => ({
            ...machineReportMedia,
            mediaUrl: this.storageService.generateSasUrl(
              machineReportMedia.mediaUrl,
            ),
            thumbnailUrl: machineReportMedia.mimeType.startsWith(
              VIDEO_MIME_TYPE,
            )
              ? this.storageService.generateSasUrl(
                  this.storageService.generateThumbnailPath(
                    machineReportMedia.mediaUrl,
                  ),
                )
              : null,
          }),
        ),
      }),
    );

    return plainToInstance(GetMachineReportResponsesOutput, {
      machineReportId: machineReport.machineReportId,
      reportTitle: machineReport.reportTitle,
      reportStatus: machineReport.currentStatus,
      reportedAt: firstReportResponse.commentedAt,
      reportResponseStatus: lastReportResponse.status,
      machineReportResponses: machineReportResponses,
      isRead: !!machineReport.machineReportUserReads.length,
    });
  }

  async getMachineReportDetail(
    ctx: RequestContext,
    params: GroupMachineReportParam,
  ): Promise<GetMachineReportDetailOutput> {
    this.logger.log(ctx, `${this.getMachineReportDetail.name} was called`);

    const { machineReportId } = params;
    const machineReport =
      await this.machineReportRepository.getMachineReportInfo(
        machineReportId,
        ctx.user.userId,
        ctx.isoLocaleCode,
      );

    const firstReportResponse = machineReport.machineReportResponses[0];
    const machineReportResponses = [
      {
        ...firstReportResponse,
        ...firstReportResponse.user,
        isChangeStatus: false,
        userPictureUrl: this.storageService.generateSasUrl(
          firstReportResponse.user.pictureUrl,
        ),
        timeSinceCommentCreation: this.creationTimeDuration(
          ctx.isoLocaleCode,
          firstReportResponse.commentedAt,
        ),
        reportResponseStatus: firstReportResponse.status,
        machineReportMedias: firstReportResponse.machineReportMedias.map(
          (machineReportMedia) => ({
            ...machineReportMedia,
            mediaUrl: this.storageService.generateSasUrl(
              machineReportMedia.mediaUrl,
            ),
            thumbnailUrl: machineReportMedia.mimeType.startsWith(
              VIDEO_MIME_TYPE,
            )
              ? this.storageService.generateSasUrl(
                  this.storageService.generateThumbnailPath(
                    machineReportMedia.mediaUrl,
                  ),
                )
              : null,
          }),
        ),
        serviceMeterInHour: firstReportResponse.serviceMeterInHour,
      },
    ];

    return plainToInstance(GetMachineReportDetailOutput, {
      machineReportId: machineReport.machineReportId,
      reportTitle: machineReport.reportTitle,
      reportStatus: machineReport.currentStatus,
      reportedAt: firstReportResponse.commentedAt,
      reportResponseStatus: firstReportResponse.status,
      machineReportResponses: machineReportResponses,
      isRead:
        machineReport.firstMachineReportResponseId ===
        machineReport.lastMachineReportResponseId
          ? !!machineReport.machineReportUserReads.length
          : true,
    });
  }

  async createMachineReport(
    ctx: RequestContext,
    params: GroupMachineParam,
    input: MachineReportInput,
    groupContext: Group,
  ): Promise<MachineReportOutput> {
    this.logger.log(ctx, `${this.createMachineReport.name} was called`);

    const userId = ctx.user.userId;
    const { machineId, groupId } = params;

    if (!input.reportComment && !input.machineReportMedias?.length) {
      throw new BadRequestException(
        'The request form must have at least one field.',
      );
    }

    // Create transaction
    const machineReport = await this.dataSource.transaction(async (tx) => {
      const timeNow = new Date();
      const machineReportId = ulid();
      const machineReportResponseId = ulid();
      const machineReportRepo = tx.getRepository(MachineReport);
      const machineReportResponseRepo = tx.getRepository(MachineReportResponse);
      const machineReportMediaRepo = tx.getRepository(MachineReportMedia);
      const machineReportUserReadRepo = tx.getRepository(MachineReportUserRead);
      const machineReportHistoryRepo = tx.getRepository(MachineReportHistory);
      const machineRepo = tx.getRepository(Machine);

      // Create machine report
      const machineReport = machineReportRepo.create({
        ...input,
        machineReportId,
        currentStatus: MachineReportCurrentStatus.POSTED,
        machineId: machineId,
        firstMachineReportResponseId: machineReportResponseId,
        lastMachineReportResponseId: machineReportResponseId,
        lastStatusUpdatedAt: timeNow,
      });

      await machineReportRepo.insert(machineReport);

      // Create machine report response
      await machineReportResponseRepo.insert({
        ...input,
        machineReportResponseId,
        reportComment: input.reportComment || '',
        commentedAt: timeNow,
        userId: userId,
        status: MachineReportResponseStatus.UNADDRESSED,
        machineReportId: machineReportId,
        subtype: Subtype.INCIDENT_REPORTS,
      });

      // Create machine report media
      if (input.machineReportMedias?.length) {
        await machineReportMediaRepo.insert(
          input.machineReportMedias.map((media) => ({
            ...media,
            machineReportResponseId: machineReportResponseId,
            createdAt: timeNow,
          })),
        );
      }

      // Create machine report user read
      await machineReportUserReadRepo.insert({
        machineReportId: machineReportId,
        userId: userId,
        readAt: timeNow,
      });

      // Create machine report histories
      await machineReportHistoryRepo.insert({
        ...machineReport,
        eventType: EventType.CREATE,
        eventAt: timeNow,
        actionedByUserId: userId,
      });

      if (!isNil(input.serviceMeterInHour)) {
        await machineRepo.update(machineId, {
          lastServiceMeter: input.serviceMeterInHour.toFixed(1),
          lastServiceMeterUpdatedAt: timeNow,
        });
      }
      return machineReport;
    });

    this.handlePushNotiForMachineReport(
      ctx,
      groupId,
      machineId,
      groupContext,
      machineReport,
    );

    return plainToInstance(MachineReportOutput, machineReport);
  }

  async handlePushNotiForMachineReport(
    ctx: RequestContext,
    groupId: string,
    machineId: string,
    groupContext: Group,
    machineReport: Record<string, any>,
    reportResponseStatus: string = MachineReportResponseStatus.UNADDRESSED,
    subType: string = Subtype.INCIDENT_REPORTS,
  ) {
    try {
      const { userId, surname, givenName } = ctx.user;
      const userSettingNotifications =
        await this.userRepository.getUserDevicesInGroup(
          groupId,
          userId,
          false,
          true,
        );

      if (userSettingNotifications?.length) {
        const data = {
          actionByUserId: userId,
          givenName,
          surname,
          groupId,
          groupName: groupContext.groupName,
          machineId,
          customerMachineName: groupContext.machines[0].machineName,
          machineReportId: machineReport.machineReportId,
          machineReportResponseId: machineReport.lastMachineReportResponseId,
        };
        const groupDevices = groupDeviceUsersByLocaleCode(
          userSettingNotifications,
        );

        let messageKey = 'message.firebaseMessages.updatedReport';
        let contentCode =
          NotificationContentCode.INCIDENT_REPORT_UPDATED_AND_UNADDRESSED;
        if (subType === Subtype.MAINTENANCE_REPORTS) {
          messageKey = 'message.firebaseMessages.registeredMaintenanceReport';
          contentCode = NotificationContentCode.MAINTENANCE_REPORT_POSTED;
        } else if (
          machineReport.currentStatus === MachineReportCurrentStatus.POSTED
        ) {
          messageKey = 'message.firebaseMessages.registeredReport';
          contentCode = NotificationContentCode.INCIDENT_REPORT_POSTED;
        } else if (
          reportResponseStatus === MachineReportResponseStatus.RESOLVED
        ) {
          messageKey = 'message.firebaseMessages.resolvedReport';
          contentCode =
            NotificationContentCode.INCIDENT_REPORT_UPDATED_AND_RESOLVED;
        }

        await this.firebaseService.sendNotificationsByLocalCode(
          ctx,
          groupDevices,
          data,
          messageKey,
          contentCode,
        );
      }
    } catch (error) {
      this.logger.error(ctx, 'Error when push notification machine report.', {
        error,
      });
    }
  }

  creationTimeDuration(
    localeCode: ISOLocaleCode,
    timeAt: Date,
    timeNow: Date = new Date(),
  ): string {
    const duration = dayjs(timeNow).diff(timeAt, 'seconds');

    const datetime = {
      day: Math.floor(duration / 86400), // 60*60*24
      hour: Math.floor(duration / 3600), // 60*60
      minute: Math.floor(duration / 60) || 1,
    };

    for (const key in datetime) {
      if (datetime[key]) {
        return this.i18n.t(
          `message.duration.${key}${datetime[key] === 1 ? '' : 's'}`,
          {
            lang: localeCode,
            args: {
              value: datetime[key],
            },
          },
        );
      }
    }
  }

  async createMachineReportResponse(
    ctx: RequestContext,
    params: GroupMachineReportParam,
    input: MachineReportResponseInput,
    groupContext: Group,
  ): Promise<MachineReportResponseOutput> {
    this.logger.log(ctx, `${this.createMachineReportResponse.name} was called`);

    const { machineId, machineReportId, groupId } = params;
    if (
      !(
        input.reportComment ||
        input.status ||
        input.reportActionChoiceIds?.length ||
        input.machineReportMedias?.length
      )
    ) {
      throw new BadRequestException(
        'The request form must have at least one field.',
      );
    }

    const machineReport = groupContext.machines[0].machineReports[0];

    if (input.reportActionChoiceIds?.length) {
      const actionChoice = await this.reportActionChoiceRepository.find({
        where: {
          reportActionChoiceId: In(input.reportActionChoiceIds),
        },
      });

      if (actionChoice.length !== input.reportActionChoiceIds.length) {
        throw new BadRequestException('Action choice is invalid.');
      }
    }

    // Create transaction
    const reportData = await this.dataSource.transaction(async (tx) => {
      const timeNow = new Date();
      const userId = ctx.user.userId;
      const machineReportRepo = tx.getRepository(MachineReport);
      const machineReportHistoryRepo = tx.getRepository(MachineReportHistory);
      const machineReportResponseRepo = tx.getRepository(MachineReportResponse);
      const machineReportMediaRepo = tx.getRepository(MachineReportMedia);
      const reportActionRepo = tx.getRepository(ReportAction);
      const machineReportUserReadRepo = tx.getRepository(MachineReportUserRead);

      if (!input.status) {
        const newestResponse = await machineReportResponseRepo.findOne({
          where: { machineReportId },
          order: { commentedAt: 'DESC' },
        });

        input.status = newestResponse.status;
      }

      // Create report response
      const reportResponse = await machineReportResponseRepo.save({
        ...input,
        reportComment: input.reportComment || '',
        commentedAt: timeNow,
        machineReportId: machineReportId,
        userId: userId,
        status: input.status,
        subtype: Subtype.STATUS_UPDATES,
      });

      // Update machine report
      const updateMachineReport = machineReportRepo.create({
        ...machineReport,
        currentStatus: MachineReportCurrentStatus.UPDATED,
        lastStatusUpdatedAt: timeNow,
        lastMachineReportResponseId: reportResponse.machineReportResponseId,
      });
      await machineReportRepo.update(machineReportId, updateMachineReport);

      // Create machine report history
      await machineReportHistoryRepo.insert(
        machineReportHistoryRepo.create({
          ...updateMachineReport,
          eventType: EventType.UPDATE,
          eventAt: timeNow,
          actionedByUserId: userId,
        }),
      );

      // Create pictures of report response
      if (input.machineReportMedias?.length) {
        await machineReportMediaRepo.insert(
          input.machineReportMedias.map((pictureUrl) => ({
            ...pictureUrl,
            mediaUrl: pictureUrl.filePath || pictureUrl.mediaUrl,
            machineReportResponseId: reportResponse.machineReportResponseId,
            createdAt: timeNow,
          })),
        );
      }

      // Create action choices of report response
      if (input.reportActionChoiceIds?.length) {
        await reportActionRepo.insert(
          input.reportActionChoiceIds.map((reportActionChoiceId) => ({
            reportActionChoiceId: reportActionChoiceId,
            machineReportResponseId: reportResponse.machineReportResponseId,
            actionAt: timeNow,
          })),
        );
      }

      // Reset all user read machine report
      await machineReportUserReadRepo.delete({ machineReportId });

      // Insert current user read machine report
      await machineReportUserReadRepo.insert({
        userId: userId,
        machineReportId: machineReportId,
        readAt: timeNow,
      });

      return { reportResponse, updateMachineReport };
    });

    this.handlePushNotiForMachineReport(
      ctx,
      groupId,
      machineId,
      groupContext,
      reportData.updateMachineReport,
      input.status,
    );

    return plainToInstance(
      MachineReportResponseOutput,
      reportData.reportResponse,
    );
  }

  async getListMachineReportForWebapp(
    ctx: RequestContext,
    params: GroupMachineParam,
    query: GetMachineReportsForWebappQuery,
  ): Promise<BaseApiResponse<GetMachineReportsForWebappOutput[]>> {
    this.logger.log(
      ctx,
      `${this.getListMachineReportForWebapp.name} was called`,
    );

    const { machineId } = params;
    const { limit, page, responseStatus, orderBys } = query;
    const {
      isoLocaleCode,
      user: { userId },
    } = ctx;
    const offset = limit ? (page - 1) * limit : 0;

    const [listMachineReport, total] = await Promise.all([
      this.machineReportRepository.getListMachineReportForWebapp(
        machineId,
        limit,
        offset,
        isoLocaleCode,
        responseStatus,
        orderBys,
        userId,
      ),
      this.machineReportRepository.countMachineReportForWebapp(
        machineId,
        responseStatus,
      ),
    ]);

    let actionChoiceMap;

    if (listMachineReport.length && limit) {
      const machineReportIds = listMachineReport.map(
        (machineReport) => machineReport.machineReportId,
      );

      const machineReportActionChoices =
        await this.machineReportRepository.getReportActionChoiceForWebapp(
          machineReportIds,
          isoLocaleCode,
        );

      actionChoiceMap = new Map<string, ReportActionOutput[]>(
        machineReportActionChoices.map((reportActionChoice) => [
          reportActionChoice.machineReportId,
          reportActionChoice.lastMachineReportResponse.reportActions.map(
            (reportAction) =>
              ({
                reportActionCode:
                  reportAction.reportActionChoice.reportActionChoiceCode,
                reportActionName:
                  reportAction.reportActionChoice.reportActionChoiceTranslation
                    .reportActionChoiceName,
              } as ReportActionOutput),
          ),
        ]),
      );
    }

    return {
      data: plainToInstance(
        GetMachineReportsForWebappOutput,
        listMachineReport.map((machineReport) => ({
          ...machineReport,
          userPictureUrl: this.storageService.generateSasUrl(
            machineReport.userPictureUrl,
          ),
          reportType: machineReport.reportType
            ? MachineReportType.INSPECTION
            : MachineReportType.MACHINE,
          timeSinceCommentCreation: this.creationTimeDuration(
            ctx.isoLocaleCode,
            machineReport.reportedAt,
          ),
          reportActions:
            actionChoiceMap?.get(machineReport.machineReportId) ?? [],
          isRead: !!machineReport.isRead,
        })),
      ),
      meta: {
        pageInfo: {
          total,
          page,
          limit,
          nextPage: offset + limit < total,
        },
      },
    };
  }

  async createMachineReportOffline(
    group: Group,
    ctx: RequestContext,
    params: GroupMachineParam,
    input: SyncMachineReportInput,
  ): Promise<SyncMachineReportOutput> {
    this.logger.log(ctx, `${this.createMachineReport.name} was called`);
    const { userId } = ctx.user;
    const { machineReportId, machineReportResponseId, lastStatusUpdatedAt } =
      input;
    const { machineId, groupId } = params;

    if (!input.reportComment && !input.machineReportMedias?.length) {
      throw new BadRequestException(
        'The request form must have at least one field.',
      );
    }

    // Create transaction
    let machineReport;
    try {
      machineReport = await this.dataSource.transaction(async (tx) => {
        const machineReportRepo = tx.getRepository(MachineReport);
        const machineReportResponseRepo = tx.getRepository(
          MachineReportResponse,
        );
        const machineReportMediaRepo = tx.getRepository(MachineReportMedia);
        const machineReportUserReadRepo = tx.getRepository(
          MachineReportUserRead,
        );
        const machineReportHistoryRepo = tx.getRepository(MachineReportHistory);
        const machineRepo = tx.getRepository(Machine);

        // Create machine report
        const machineReport = machineReportRepo.create({
          ...input,
          machineReportId,
          currentStatus: MachineReportCurrentStatus.POSTED,
          machineId: machineId,
          firstMachineReportResponseId: machineReportResponseId,
          lastMachineReportResponseId: machineReportResponseId,
          lastStatusUpdatedAt: lastStatusUpdatedAt,
        });

        await machineReportRepo.insert(machineReport);

        // Create machine report response
        await machineReportResponseRepo.insert({
          ...input,
          machineReportResponseId,
          reportComment: input.reportComment || '',
          commentedAt: lastStatusUpdatedAt,
          userId: userId,
          status: MachineReportResponseStatus.UNADDRESSED,
          machineReportId: machineReportId,
          subtype: Subtype.INCIDENT_REPORTS,
        });

        // Create machine report media
        if (input.machineReportMedias?.length) {
          await machineReportMediaRepo.insert(
            input.machineReportMedias.map((media) => ({
              ...media,
              machineReportResponseId: machineReportResponseId,
              createdAt: lastStatusUpdatedAt,
            })),
          );
        }

        // Create machine report user read
        await machineReportUserReadRepo.insert({
          machineReportId: machineReportId,
          userId: userId,
          readAt: lastStatusUpdatedAt,
        });

        // Create machine report histories
        await machineReportHistoryRepo.insert({
          ...machineReport,
          eventType: EventType.CREATE,
          eventAt: lastStatusUpdatedAt,
          actionedByUserId: userId,
        });

        const { lastServiceMeterUpdatedAt } = group.machines[0];
        if (
          !isNil(input.serviceMeterInHour) &&
          (!lastServiceMeterUpdatedAt ||
            lastServiceMeterUpdatedAt <= lastStatusUpdatedAt)
        ) {
          await machineRepo.update(machineId, {
            lastServiceMeter: formatServiceMeter(
              input.serviceMeterInHour.toString(),
            ),
            lastServiceMeterUpdatedAt: lastStatusUpdatedAt,
          });
        }
        return machineReport;
      });
    } catch (error) {
      const duplicateErrorCode = 'Error: Violation of PRIMARY KEY';
      if (error.message.includes(duplicateErrorCode)) {
        this.logger.error(ctx, error.message, { error });
        return plainToInstance(SyncMachineReportOutput, {
          ...input,
          machineId,
          currentStatus: MachineReportCurrentStatus.POSTED,
          syncStatus: StatusName.SYNCED,
        });
      }
      throw error;
    }
    if (
      group.currentStatus !== GroupCurrentStatus.DELETED &&
      group.machines[0].currentStatus !== MachineCurrentStatus.DELETED
    ) {
      this.handlePushNotiForMachineReport(
        ctx,
        groupId,
        machineId,
        group,
        machineReport,
      );
    }
    return plainToInstance(SyncMachineReportOutput, {
      ...machineReport,
      syncStatus: StatusName.SYNCED,
    });
  }

  async createMachineOperationReport(
    ctx: RequestContext,
    params: GroupMachineParam,
    input: MachineOperationReportInput,
  ): Promise<MachineReportOutput> {
    this.logger.log(ctx, `${this.createMachineReportResponse.name} was called`);

    const userId = ctx.user.userId;
    const machineId = params.machineId;
    const machineReport = await this.dataSource.transaction(async (tx) => {
      const timeNow = new Date();
      const machineReportId = ulid();
      const machineReportResponseId = ulid();
      const machineReportRepo = tx.getRepository(MachineReport);
      const machineReportHistoryRepo = tx.getRepository(MachineReportHistory);
      const machineReportResponseRepo = tx.getRepository(MachineReportResponse);
      const machineOperationReportRepo = tx.getRepository(
        MachineOperationReport,
      );

      // Create machine report
      const machineReport = machineReportRepo.create({
        reportTitle: '',
        machineReportId,
        currentStatus: MachineReportCurrentStatus.POSTED,
        machineId: machineId,
        firstMachineReportResponseId: machineReportResponseId,
        lastMachineReportResponseId: machineReportResponseId,
        lastStatusUpdatedAt: timeNow,
      });
      await machineReportRepo.insert(machineReport);

      // Create machine report response
      await machineReportResponseRepo.insert({
        ...input,
        machineReportResponseId,
        reportComment: '',
        commentedAt: timeNow,
        userId: userId,
        status: null,
        machineReportId: machineReportId,
        subtype: Subtype.MACHINE_OPERATION_REPORTS,
      });

      // Create machine report histories
      await machineReportHistoryRepo.insert({
        ...machineReport,
        eventType: EventType.CREATE,
        eventAt: timeNow,
        actionedByUserId: userId,
      });

      //Create machine operation reports
      await machineOperationReportRepo.insert({
        ...input,
        comment: input.comment ?? '',
        machineReportResponseId,
      });

      return machineReport;
    });

    return plainToInstance(MachineReportOutput, machineReport);
  }

  async createFuelMaintenanceReport(
    input: FuelMaintenanceReportInput,
    params: GroupMachineParam,
    ctx: RequestContext,
  ): Promise<MachineReportOutput> {
    this.logger.log(ctx, `${this.createMachineReport.name} was called`);

    const { machineId } = params;
    const { userId } = ctx.user;

    // Create transaction
    const machineReport = await this.dataSource.transaction(async (tx) => {
      const timeNow = new Date();
      const machineReportId = ulid();
      const machineReportResponseId = ulid();
      const machineReportRepo = tx.getRepository(MachineReport);
      const machineReportResponseRepo = tx.getRepository(MachineReportResponse);
      const fuelRefillRepo = tx.getRepository(FuelRefill);
      const oilCoolantRefillExchangeRepo = tx.getRepository(
        OilCoolantRefillExchange,
      );
      const partReplacementRepo = tx.getRepository(PartReplacement);
      const partReplacementMediaRepo = tx.getRepository(PartReplacementMedia);
      const fuelMaintenanceReportRepo = tx.getRepository(FuelMaintenanceReport);
      const machineReportHistoryRepo = tx.getRepository(MachineReportHistory);
      const machineRepo = tx.getRepository(Machine);

      // Create machine report
      const machineReport = machineReportRepo.create({
        reportTitle: '',
        machineReportId,
        currentStatus: MachineReportCurrentStatus.POSTED,
        machineId: machineId,
        firstMachineReportResponseId: machineReportResponseId,
        lastMachineReportResponseId: machineReportResponseId,
        lastStatusUpdatedAt: timeNow,
      });

      await machineReportRepo.insert(machineReport);

      // Create machine report response
      await machineReportResponseRepo.insert({
        ...input,
        status: null,
        machineReportResponseId,
        reportComment: '',
        commentedAt: timeNow,
        userId: userId,
        machineReportId: machineReportId,
        subtype: Subtype.FUEL_MAINTENANCE_REPORTS,
        serviceMeterInHour: null,
      });

      // Create fuel maintenance report
      await fuelMaintenanceReportRepo.insert(
        fuelMaintenanceReportRepo.create({ ...input, machineReportResponseId }),
      );

      // Create fuel refill
      if (input.fuelRefill) {
        await fuelRefillRepo.insert({
          ...input.fuelRefill,
          machineReportResponseId,
          comment: input.fuelRefill.comment ?? '',
        });
      }

      // Create oil coolant refill exchanges
      if (input.oilCoolantRefillExchanges?.length) {
        await oilCoolantRefillExchangeRepo.insert(
          input.oilCoolantRefillExchanges.map((ocre) => ({
            ...ocre,
            machineReportResponseId,
            comment: ocre.comment ?? '',
          })),
        );
      }

      // Create part replacement
      if (input.partReplacements?.length) {
        for (const partReplacement of input.partReplacements) {
          const partReplacementId = ulid();
          await partReplacementRepo.insert({
            ...partReplacement,
            partReplacementId,
            machineReportResponseId,
          });

          // Create part replacement media
          if (partReplacement.partReplacementMedias?.length)
            partReplacementMediaRepo.insert(
              partReplacement.partReplacementMedias.map(
                (partReplacementMedia) => ({
                  ...partReplacementMedia,
                  createdAt: timeNow,
                  partReplacementId,
                }),
              ),
            );
        }
      }

      // Create machine report histories
      await machineReportHistoryRepo.insert({
        ...machineReport,
        eventType: EventType.CREATE,
        eventAt: timeNow,
        actionedByUserId: userId,
      });

      if (!isNil(input.serviceMeterInHour)) {
        await machineRepo.update(machineId, {
          lastServiceMeter: input.serviceMeterInHour.toFixed(1),
          lastServiceMeterUpdatedAt: timeNow,
        });
      }

      return machineReport;
    });

    return plainToInstance(MachineReportOutput, machineReport);
  }

  async getReportFilterCount(
    ctx: RequestContext,
    params: GroupMachineParam,
    query: GetReportFilterCountQuery,
    groupContext: Group,
  ): Promise<GetReportFilterCountOutput> {
    this.logger.log(ctx, `${this.getReportFilterCount.name} was called`);

    const timeNow = dayjs();
    const startDate = convertTimezoneToUTC(
      query.startDate ? dayjs(query.startDate) : timeNow.subtract(31, 'day'),
      query.utc,
    );
    const endDate = convertTimezoneToUTC(
      timeNow.add(1, 'day').startOf('day'),
      query.utc,
    );
    const filterBy = { startDate, endDate };
    const countReportSummary =
      await this.machineReportRepository.countReportSummary(
        params.machineId,
        filterBy,
      );

    return plainToInstance(GetReportFilterCountOutput, {
      ...this.handleTotalReportCount(countReportSummary),
      latestServiceMeter: formatServiceMeter(
        groupContext.machines[0].lastServiceMeter,
      ),
      latestServiceMeterUpdatedAt:
        groupContext.machines[0].lastServiceMeterUpdatedAt,
    });
  }

  async getMachineOperationReportDetail(
    ctx: RequestContext,
    params: GroupMachineReportParam,
  ): Promise<GetMachineOperationReportDetailOutput> {
    this.logger.log(
      ctx,
      `${this.getMachineOperationReportDetail.name} was called`,
    );

    const machineReportId = params.machineReportId;
    const machineReport =
      await this.machineReportRepository.getMachineOperationReportDetail(
        machineReportId,
        ctx.user.userId,
        ctx.isoLocaleCode,
      );

    if (!machineReport) {
      throw new NotFoundException('machine Operation Report not found');
    }

    const firstReportResponse = machineReport.firstMachineReportResponse;

    return plainToInstance(GetMachineOperationReportDetailOutput, {
      ...firstReportResponse.user,
      ...firstReportResponse,
      ...firstReportResponse.machineOperationReport,
      ...machineReport,
      reportedAt: firstReportResponse.commentedAt,
      userPictureUrl: this.storageService.generateSasUrl(
        firstReportResponse.user.pictureUrl,
      ),
      timeSinceCommentCreation: this.creationTimeDuration(
        ctx.isoLocaleCode,
        firstReportResponse.commentedAt,
      ),
    });
  }

  async getMachineSummary(
    ctx: RequestContext,
    params: GroupMachineParam,
    query: GetMachineSummaryQuery,
  ): Promise<BaseApiResponse<GetMachineSummaryOutput[]>> {
    this.logger.log(ctx, `${this.getMachineSummary.name} was called`);

    const { machineId } = params;
    const { limit, page, filter, orderBys } = query;
    const { isoLocaleCode } = ctx;
    const offset = limit ? (page - 1) * limit : 0;
    const timeNow = dayjs();
    const startDate = convertTimezoneToUTC(
      query.startDate ? dayjs(query.startDate) : timeNow.subtract(31, 'day'),
      query.utc,
    );
    const endDate = convertTimezoneToUTC(
      timeNow.add(1, 'day').startOf('day'),
      query.utc,
    );
    const filterBy = {
      startDate,
      endDate,
      filter,
      limit,
      offset,
      orderBys,
      reportTypeTitle: this.i18n.t('message.reportType', {
        lang: isoLocaleCode,
      }) as Record<string, string>,
      isoLocaleCode,
    };
    const [listMachineSummary, totalReportCount] = await Promise.all([
      this.machineReportRepository.getListMachineSummary(machineId, filterBy),
      this.machineReportRepository.countReportSummary(machineId, filterBy),
    ]);

    const total = this.handleTotalReportCount(totalReportCount).reportCount;
    return {
      data: plainToInstance(
        GetMachineSummaryOutput,
        listMachineSummary.map((machineReport) => {
          const {
            reportType,
            inspectionResultId,
            serviceMeter,
            userPictureUrl,
          } = machineReport;

          return {
            ...machineReport,
            reportSubType: this.handleSubtype(reportType, inspectionResultId),
            serviceMeter: serviceMeter ?? null,
            userPictureUrl: this.storageService.generateSasUrl(userPictureUrl),
          };
        }),
      ),
      meta: {
        pageInfo: {
          total,
          page,
          limit,
          nextPage: offset + limit < total,
        },
      },
    };
  }

  handleSubtype(reportType: any, inspectionResultId: any) {
    return reportType === MachineSummaryType.INCIDENT_REPORTS
      ? inspectionResultId
        ? NotificationType.INSPECTION
        : NotificationType.MACHINE_REPORT
      : null;
  }

  async getFuelMaintenanceReportDetail(
    ctx: RequestContext,
    params: GroupMachineReportParam,
  ): Promise<GetFuelMaintenanceReportDetailOutput> {
    const machineReportId = params.machineReportId;
    const isoLocaleCode = ctx.isoLocaleCode;

    const machineReport =
      await this.machineReportRepository.getFuelMaintenanceReportDetail(
        isoLocaleCode,
        machineReportId,
      );

    if (!machineReport) {
      throw new NotFoundException('Fuel maintenance report not found.');
    }

    const fuelReport =
      machineReport.firstMachineReportResponse.fuelMaintenanceReport;

    return plainToInstance(GetFuelMaintenanceReportDetailOutput, {
      ...machineReport,
      ...machineReport.firstMachineReportResponse,
      ...fuelReport,
      ...machineReport.firstMachineReportResponse.user,
      userPictureUrl: this.storageService.generateSasUrl(
        machineReport.firstMachineReportResponse.user.pictureUrl,
      ),
      timeSinceCommentCreation: this.creationTimeDuration(
        ctx.isoLocaleCode,
        machineReport.firstMachineReportResponse.commentedAt,
      ),
      oilCoolantRefillExchanges: fuelReport.oilCoolantRefillExchanges?.map(
        (ocre) => ({
          ...ocre,
          oilTypeName: ocre.oilType.oilTypeTranslation.oilTypeName,
        }),
      ),
      partReplacements: fuelReport.partReplacements?.map((partReplacement) => ({
        ...partReplacement,
        oilTypeName: partReplacement.partType.partTypeTranslation.partTypeName,
        partReplacementMedias: partReplacement.partReplacementMedias.map(
          (media) => ({
            ...media,
            mediaUrl: this.storageService.generateSasUrl(media.mediaUrl),
            thumbnail: media.mimeType.startsWith(VIDEO_MIME_TYPE)
              ? this.storageService.generateSasUrl(
                  this.storageService.generateThumbnailPath(media.mediaUrl),
                )
              : null,
          }),
        ),
      })),
    });
  }

  handleTotalReportCount(countReportSummary: Record<string, any>) {
    const {
      INSPECTION: inspectionReportCount = 0,
      MAINTENANCE_REPORTS: maintenanceReportCount = 0,
      INCIDENT_REPORTS: incidentReportCount = 0,
    } = countReportSummary.reduce(
      (acc: Record<string, any>, curr: Record<string, any>) => {
        acc[curr.reportType] = +curr.count;
        return acc;
      },
      {},
    );

    return {
      reportCount:
        inspectionReportCount + maintenanceReportCount + incidentReportCount,
      inspectionReportCount,
      maintenanceReportCount,
      incidentReportCount,
    };
  }

  async createMaintenanceReport(
    input: MaintenanceReportInput,
    params: GroupMachineParam,
    ctx: RequestContext,
    groupContext: Group,
  ): Promise<MachineReportOutput> {
    this.logger.log(ctx, `${this.createMaintenanceReport.name} was called`);

    if (dayjs().isBefore(input.workAt)) {
      throw new BadRequestException({
        customMessage: this.i18n.t(
          'message.maintenanceReport.workAtPastError',
          {
            lang: ctx.isoLocaleCode,
          },
        ),
      });
    }
    const {
      irregularMaintenanceItemChoiceIds: irregularIds = [],
      regularMaintenanceItemChoiceId: regularId,
      maintenanceReasonChoiceId: reasonId,
      maintenanceReasonPeriodChoiceId: reasonPeriodId,
    } = input;

    const { machineId, groupId } = params;
    const { userId } = ctx.user;

    await this.validateMaintenanceReportInput(
      irregularIds,
      regularId,
      reasonId,
      reasonPeriodId,
    );

    // Create transaction
    const machineReport = await this.dataSource.transaction(async (tx) => {
      const timeNow = new Date();
      const machineReportId = ulid();
      const machineReportResponseId = ulid();
      const machineReportRepo = tx.getRepository(MachineReport);
      const machineReportResponseRepo = tx.getRepository(MachineReportResponse);
      const machineReportHistoryRepo = tx.getRepository(MachineReportHistory);
      const machineRepo = tx.getRepository(Machine);
      const maintenanceReportRepo = tx.getRepository(MaintenanceReport);
      const mTRIMIRepo = tx.getRepository(
        MaintenanceReportIrregularMaintenanceItem,
      );
      const machineReportMediaRepo = tx.getRepository(MachineReportMedia);

      // Create machine report
      const machineReport = machineReportRepo.create({
        reportTitle: '',
        machineReportId,
        currentStatus: MachineReportCurrentStatus.POSTED,
        machineId: machineId,
        firstMachineReportResponseId: machineReportResponseId,
        lastMachineReportResponseId: machineReportResponseId,
        lastStatusUpdatedAt: timeNow,
      });

      await machineReportRepo.insert(machineReport);

      // Create machine report response
      await machineReportResponseRepo.insert({
        ...input,
        status: null,
        machineReportResponseId,
        reportComment: '',
        commentedAt: timeNow,
        userId: userId,
        machineReportId: machineReportId,
        subtype: Subtype.MAINTENANCE_REPORTS,
        serviceMeterInHour: null,
      });

      // Create machine report histories
      await machineReportHistoryRepo.insert({
        ...machineReport,
        eventType: EventType.CREATE,
        eventAt: timeNow,
        actionedByUserId: userId,
      });

      // Create machine report media
      if (input.machineReportMedias?.length) {
        await machineReportMediaRepo.insert(
          input.machineReportMedias.map((media) => ({
            ...media,
            machineReportResponseId: machineReportResponseId,
            createdAt: timeNow,
            mediaUrl: media.mediaUrl ?? media.filePath,
          })),
        );
      }

      // Update service meter in hour of machine
      if (!(groupContext.machines[0].lastServiceMeterUpdatedAt > input.workAt))
        await machineRepo.update(machineId, {
          lastServiceMeter: input.serviceMeterInHour.toFixed(1),
          lastServiceMeterUpdatedAt: input.workAt,
        });

      // Create maintenance report
      await maintenanceReportRepo.insert({
        ...input,
        machineReportResponseId: machineReportResponseId,
        comment: input.comment ?? '',
      });

      // Create maintenance report irregular maintenance item
      if (irregularIds?.length) {
        await mTRIMIRepo.insert(
          irregularIds.map((choiceId) => ({
            machineReportResponseId,
            irregularMaintenanceItemChoiceId: choiceId,
          })),
        );
      }

      return machineReport;
    });

    this.handlePushNotiForMachineReport(
      ctx,
      groupId,
      machineId,
      groupContext,
      machineReport,
      undefined,
      Subtype.MAINTENANCE_REPORTS,
    );

    return plainToInstance(MachineReportOutput, machineReport);
  }

  async validateMaintenanceReportInput(
    irregularIds: string[],
    regularId: string,
    reasonId: string,
    reasonPeriodId: string,
  ) {
    const [iMICs, rMIC, mRPC, mRC] = await Promise.all([
      this.irregularMaintenanceItemChoiceRepository.find({
        where: {
          irregularMaintenanceItemChoiceId: In(irregularIds),
          isDisabled: false,
        },
      }),
      this.regularMaintenanceItemChoiceRepository.findOne({
        where: {
          regularMaintenanceItemChoiceId: regularId,
          isDisabled: false,
        },
      }),
      this.maintenanceReasonPeriodChoiceRepository.findOne({
        where: {
          maintenanceReasonPeriodChoiceId: reasonPeriodId,
        },
      }),
      this.maintenanceReasonChoiceRepository.findOne({
        where: {
          maintenanceReasonChoiceId: reasonId,
        },
      }),
    ]);

    if (iMICs.length !== irregularIds.length) {
      throw new BadRequestException(
        'irregularMaintenanceItemChoiceIds not valid.',
      );
    }

    if (!rMIC) {
      throw new BadRequestException(
        'regularMaintenanceItemChoiceId not found.',
      );
    }

    if (!mRC) {
      throw new BadRequestException('maintenanceReasonChoiceId not found.');
    }

    if (
      mRC.maintenanceReasonChoiceCode ===
      MaintenanceReasonChoiceCode.PERIOD_ELAPSE
    ) {
      if (!reasonPeriodId || !mRPC) {
        throw new BadRequestException(
          'maintenanceReasonPeriodChoiceId not found.',
        );
      }
    } else if (reasonPeriodId) {
      throw new BadRequestException(
        'maintenanceReasonPeriodChoiceId invalid, maintenanceReasonChoiceCode must be PERIOD_ELAPSE',
      );
    }
  }

  async getMaintenanceReportDetail(
    ctx: RequestContext,
    params: GroupMachineReportParam,
  ): Promise<GetMaintenanceReportDetailOutput> {
    this.logger.log(ctx, `${this.getMaintenanceReportDetail.name} was called`);
    const { machineReportId } = params;
    const isoLocaleCode = ctx.isoLocaleCode;
    const machineReport =
      await this.machineReportRepository.getMaintenanceReportDetail(
        isoLocaleCode,
        machineReportId,
      );

    if (!machineReport) {
      throw new NotFoundException('Maintenance report not found.');
    }

    const {
      firstMachineReportResponse: {
        maintenanceReport,
        user,
        commentedAt,
        machineReportMedias,
        lat,
        lng,
        locationAccuracy,
      },
    } = machineReport;
    const {
      regularMaintenanceItemChoice,
      maintenanceReasonChoice,
      maintenanceReasonPeriodChoice,
    } = maintenanceReport;
    return plainToInstance(GetMaintenanceReportDetailOutput, {
      ...machineReport,
      ...maintenanceReport,
      ...user,
      reportedAt: commentedAt,
      userPictureUrl: this.storageService.generateSasUrl(user.pictureUrl),
      timeSinceCommentCreation: this.creationTimeDuration(
        ctx.isoLocaleCode,
        commentedAt,
      ),
      irregularMaintenanceItemChoices:
        maintenanceReport.maintenanceReportIrregularMaintenanceItems.map(
          (item) => ({
            ...item,
            ...item.irregularMaintenanceItemChoice,
            ...item.irregularMaintenanceItemChoice
              .irregularMaintenanceItemChoiceTranslation,
          }),
        ),
      regularMaintenanceItemChoice: {
        ...regularMaintenanceItemChoice,
        ...regularMaintenanceItemChoice.regularMaintenanceItemChoiceTranslation,
      },
      maintenanceReasonChoice: {
        ...maintenanceReasonChoice,
        ...maintenanceReasonChoice.maintenanceReasonChoiceTranslation,
      },
      maintenanceReasonPeriodChoice: maintenanceReasonPeriodChoice
        ? {
            ...maintenanceReasonPeriodChoice,
            ...maintenanceReasonPeriodChoice.maintenanceReasonPeriodChoiceTranslation,
          }
        : null,
      machineReportMedias: machineReportMedias.map((media) => ({
        ...media,
        filePath: media.mediaUrl,
        mediaUrl: this.storageService.generateSasUrl(media.mediaUrl),
        thumbnailUrl: media.mimeType.startsWith(VIDEO_MIME_TYPE)
          ? this.storageService.generateSasUrl(
              this.storageService.generateThumbnailPath(media.mediaUrl),
            )
          : null,
      })),
      lat,
      lng,
      locationAccuracy,
    });
  }
}
