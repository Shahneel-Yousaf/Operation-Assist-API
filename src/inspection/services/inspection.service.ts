import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { ContentDataNotification } from '@firebase/dtos';
import { FirebaseService } from '@firebase/services/firebase.service';
import { GroupMachineParam, MachineReportInput } from '@group/dtos';
import { Group } from '@group/entities';
import {
  CreateInspectionFormInput,
  CreateInspectionFormOutput,
  CreateInspectionInput,
  GetInspectionQuery,
  GetInspectionsForWebappOutput,
  GroupMachineInspectionFormParam,
  GroupMachineInspectionItemTemplateParam,
  GroupMachineInspectionParam,
  InspectionDetailOutput,
  InspectionFormOutput,
  InspectionFormParam,
  InspectionParam,
  ListInspectionFormsOutput,
  ListInspectionFormTemplateOutput,
  ListInspectionOutput,
  ListUserInspectionDraftsOutput,
  ListUserInspectionFormDraftsOutput,
  PaginationInputQuery,
  SyncInspectionDataInput,
  SyncInspectionDataOutput,
  UpdateInspectionFormInput,
  UpdateInspectionInput,
} from '@inspection/dtos';
import {
  CustomInspectionForm,
  CustomInspectionFormHistory,
  CustomInspectionItem,
  CustomInspectionItemHistory,
  CustomInspectionItemMedia,
  Inspection,
  InspectionHistory,
  InspectionResult,
  InspectionResultHistory,
} from '@inspection/entities';
import {
  CustomInspectionFormRepository,
  CustomInspectionItemRepository,
  InspectionFormTemplateRepository,
  InspectionFormTemplateTranslationRepository,
  InspectionRepository,
} from '@inspection/repositories';
import { Machine } from '@machine/entities';
import { MachineRepository } from '@machine/repositories';
import {
  MachineReport,
  MachineReportHistory,
  MachineReportMedia,
  MachineReportResponse,
  MachineReportUserRead,
} from '@machine-report/entities';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CustomInspectionFormCurrentStatus,
  CustomInspectionItemResultType,
  dateFormat,
  ErrorType,
  EventType,
  GroupCurrentStatus,
  InspectionCurrentStatus,
  InspectionFormType,
  InspectionResultType,
  ISOLocaleCode,
  ItemCodeType,
  MachineCurrentStatus,
  MachineReportCurrentStatus,
  MachineReportResponseStatus,
  MAX_COLUMNS_PER_PAGE,
  NotificationContentCode,
  ODOMETER_REGEX,
  SERVICE_METER_REGEX,
  StatusName,
  Subtype,
  VIDEO_MIME_TYPE,
} from '@shared/constants';
import { BaseApiResponse } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import {
  convertTimezoneToUTC,
  convertUTCToTimezone,
  formatServiceMeter,
  formatTime,
  groupDeviceUsersByLocaleCode,
  isAlphabetReporter,
  transformStringNumber,
} from '@shared/utils/commons';
import { checkCustomInspectionFormNotFound } from '@shared/utils/errors';
import {
  dateHeader,
  detailRowByTitle,
  generateHeader,
  generateTable,
  generationResult,
  inspectionResultType,
  reporter,
  timeHeader,
} from '@shared/utils/generate-pdf';
import { UserRepository } from '@user/repositories';
import { plainToInstance } from 'class-transformer';
import { isEnum, isNumberString } from 'class-validator';
import * as dayjs from 'dayjs';
import * as fs from 'fs';
import { I18nService } from 'nestjs-i18n';
import { join } from 'path';
import puppeteer from 'puppeteer';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class InspectionService {
  constructor(
    private readonly customInspectionFormRepository: CustomInspectionFormRepository,
    private readonly inspectionFormTemplateTranslationRepository: InspectionFormTemplateTranslationRepository,
    private readonly inspectionFormTemplateRepository: InspectionFormTemplateRepository,
    private readonly inspectionRepository: InspectionRepository,
    private readonly dataSource: DataSource,
    private readonly logger: AppLogger,
    private readonly i18n: I18nService,
    private readonly storageService: BlobStorageService,
    private readonly firebaseService: FirebaseService,
    private readonly userRepository: UserRepository,
    private readonly customInspectionItemRepository: CustomInspectionItemRepository,
    private readonly machineRepository: MachineRepository,
  ) {
    this.logger.setContext(InspectionService.name);
  }

  async deleteInspectionForm(ctx: RequestContext, params: InspectionFormParam) {
    this.logger.log(ctx, `${this.deleteInspectionForm.name} was called`);

    const userId = ctx.user.userId;
    const { machineId, customInspectionFormId } = params;

    const inspectionForm = await this.customInspectionFormRepository.findOne({
      where: {
        customInspectionFormId,
        machineId,
      },
    });
    if (!inspectionForm) {
      throw new NotFoundException('Inspection form not found.');
    }

    await this.dataSource.transaction(async (tx) => {
      const updatedAt = new Date();
      const customInspectionFormRepo = tx.getRepository(CustomInspectionForm);
      const customInspectionItemRepo = tx.getRepository(CustomInspectionItem);
      const customInspectionFormHistoryRepo = tx.getRepository(
        CustomInspectionFormHistory,
      );
      const customInspectionItemHistoryRepo = tx.getRepository(
        CustomInspectionItemHistory,
      );
      const customInspectionFormHistoryId = ulid();
      const updateInspectionForm = customInspectionFormRepo.create({
        ...inspectionForm,
        currentStatus: CustomInspectionFormCurrentStatus.DELETED,
        lastStatusUpdatedAt: updatedAt,
      });

      // Soft delete custom inspection form
      await customInspectionFormRepo.update(
        customInspectionFormId,
        updateInspectionForm,
      );

      // Soft delete custom inspection item
      await customInspectionItemRepo.update(
        { customInspectionFormId },
        {
          currentStatus: CustomInspectionFormCurrentStatus.DELETED,
          lastStatusUpdatedAt: updatedAt,
        },
      );

      if (
        inspectionForm.currentStatus ===
        CustomInspectionFormCurrentStatus.PUBLISHED
      ) {
        // Create inspection form history
        await customInspectionFormHistoryRepo.insert({
          ...updateInspectionForm,
          customInspectionFormHistoryId,
          eventType: EventType.DELETE,
          eventAt: updatedAt,
          actionedByUserId: userId,
        });

        const customInspectionItems = await customInspectionItemRepo.find({
          where: {
            customInspectionFormId,
          },
        });

        // Create custom inspection item history
        await customInspectionItemHistoryRepo.insert(
          customInspectionItems.map((customInspectionItem) => ({
            ...customInspectionItem,
            customInspectionFormHistoryId,
            eventType: EventType.DELETE,
            eventAt: updatedAt,
            actionedByUserId: userId,
          })),
        );
      }
    });

    return {
      data: {},
      meta: {
        successMessage: this.i18n.t('message.inspectionForm.deleteSuccess', {
          lang: ctx.isoLocaleCode,
        }),
      },
    };
  }

  async getListInspectionForm(
    ctx: RequestContext,
    params: GroupMachineParam,
  ): Promise<ListInspectionFormsOutput[]> {
    this.logger.log(ctx, `${this.getListInspectionForm.name} was called`);

    const { machineId } = params;
    const customInspectionForms =
      await this.customInspectionFormRepository.find({
        where: {
          machineId,
          currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
        },
        order: { name: 'ASC' },
      });

    return plainToInstance(ListInspectionFormsOutput, customInspectionForms);
  }

  async getListUserInspectionFormDraft(
    ctx: RequestContext,
    params: GroupMachineParam,
  ): Promise<ListUserInspectionFormDraftsOutput[]> {
    this.logger.log(
      ctx,
      `${this.getListUserInspectionFormDraft.name} was called`,
    );

    const { machineId } = params;
    const customInspectionFormDrafts =
      await this.customInspectionFormRepository.find({
        where: {
          machineId,
          currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
          customInspectionFormHistories: {
            actionedByUserId: ctx.user.userId,
            eventType: EventType.CREATE,
          },
        },
        order: { lastStatusUpdatedAt: 'DESC' },
      });

    return plainToInstance(
      ListUserInspectionFormDraftsOutput,
      customInspectionFormDrafts,
    );
  }

  async getListTemplateAndCreatedInspectionForm(
    ctx: RequestContext,
    params: GroupMachineParam,
    machineTypeId: string,
  ): Promise<ListInspectionFormTemplateOutput> {
    this.logger.log(
      ctx,
      `${this.getListTemplateAndCreatedInspectionForm.name} was called`,
    );

    const { groupId } = params;
    const [inspectionFormTemplateTranslations, customInspectionForms] =
      await Promise.all([
        this.inspectionFormTemplateTranslationRepository.getInspectionFormTemplateByMachineTypeId(
          ctx.isoLocaleCode,
          machineTypeId,
        ),
        this.customInspectionFormRepository.getInspectionFormsInGroup(groupId),
      ]);

    return plainToInstance(ListInspectionFormTemplateOutput, {
      inspectionFormTemplates: inspectionFormTemplateTranslations,
      customInspectionForms: customInspectionForms,
    });
  }

  async createInspectionForm(
    ctx: RequestContext,
    params: GroupMachineParam,
    body: CreateInspectionFormInput,
  ): Promise<BaseApiResponse<CreateInspectionFormOutput>> {
    this.logger.log(ctx, `${this.createInspectionForm.name} was called`);
    const { machineId } = params;
    const { inspectionFormId, inspectionFormType, name, currentStatus } = body;
    const timeNow = new Date();
    const { userId } = ctx.user;

    switch (inspectionFormType) {
      case InspectionFormType.CUSTOM:
        const customInspectionForm =
          await this.customInspectionFormRepository.findOne({
            where: { customInspectionFormId: inspectionFormId },
          });

        if (!customInspectionForm) {
          throw new BadRequestException({
            message: 'The inspectionFormId is invalid.',
            errorType: ErrorType.INSPECTION_FORM_NOT_FOUND,
          });
        }

        if (
          customInspectionForm.currentStatus !==
          CustomInspectionFormCurrentStatus.PUBLISHED
        ) {
          throw new BadRequestException({
            message: 'The inspectionFormId is invalid.',
          });
        }
        break;

      case InspectionFormType.TEMPLATE:
        const inspectionFormTemplate =
          await this.inspectionFormTemplateRepository.getInspectionFormTemplateWithResultType(
            inspectionFormId,
            ctx.isoLocaleCode,
            CustomInspectionItemResultType.NUMERIC,
          );

        if (!inspectionFormTemplate) {
          throw new BadRequestException({
            message: 'The inspectionFormId is invalid.',
            errorType: ErrorType.INSPECTION_FORM_TEMPLATE_NOT_FOUND,
          });
        }
        break;
    }

    const customInspectionFormId = ulid();
    const customInspectionFormHistoryId = ulid();
    await this.dataSource.transaction(async (tx) => {
      const customInspectionFormRepo = tx.getRepository(CustomInspectionForm);
      const customInspectionFormHistoryRepo = tx.getRepository(
        CustomInspectionFormHistory,
      );
      const customInspectionForm = customInspectionFormRepo.create({
        customInspectionFormId,
        name,
        machineId,
        currentStatus,
        lastStatusUpdatedAt: timeNow,
      });
      await customInspectionFormRepo.insert(customInspectionForm);

      await customInspectionFormHistoryRepo.insert({
        ...customInspectionForm,
        customInspectionFormHistoryId,
        eventType: EventType.CREATE,
        eventAt: timeNow,
        actionedByUserId: userId,
      });

      await this.processInspectionForm(
        tx,
        userId,
        customInspectionFormId,
        customInspectionFormHistoryId,
        body,
      );
    });

    if (currentStatus === CustomInspectionFormCurrentStatus.PUBLISHED) {
      return {
        data: { customInspectionFormId },
        meta: {
          successMessage: this.i18n.t('message.inspectionForm.publishSuccess', {
            lang: ctx.isoLocaleCode,
          }),
        },
      };
    }

    return {
      data: { customInspectionFormId },
      meta: {},
    };
  }

  async updateInspectionForm(
    ctx: RequestContext,
    params: GroupMachineInspectionFormParam,
    body: UpdateInspectionFormInput,
    customInspectionForm: CustomInspectionForm,
  ): Promise<BaseApiResponse<CreateInspectionFormOutput>> {
    this.logger.log(ctx, `${this.updateInspectionForm.name} was called`);

    const { machineId } = params;
    const timeNow = new Date();
    const { customInspectionFormId } = customInspectionForm;
    const { userId } = ctx.user;
    const { name } = body;

    if (
      customInspectionForm.currentStatus ===
      CustomInspectionFormCurrentStatus.PUBLISHED
    ) {
      await this.updateInspectionFormName(name, customInspectionForm);

      return {
        data: { customInspectionFormId },
        meta: {},
      };
    }

    if (body.customInspectionItems?.length < 2) {
      throw new BadRequestException({
        message: 'customInspectionItems must contain at least 2 elements',
      });
    }

    if (!body.currentStatus) {
      throw new BadRequestException({
        message: 'currentStatus must be not empty',
      });
    }

    const { currentStatus } = body;
    await this.dataSource.transaction(async (tx) => {
      const customInspectionFormRepo = tx.getRepository(CustomInspectionForm);
      const customInspectionFormHistoryRepo = tx.getRepository(
        CustomInspectionFormHistory,
      );
      const customInspectionItemRepo = tx.getRepository(CustomInspectionItem);
      const customInspectionItemMediaRepo = tx.getRepository(
        CustomInspectionItemMedia,
      );
      const customInspectionItemHistoryRepo = tx.getRepository(
        CustomInspectionItemHistory,
      );

      const customInspectionFormItems = await customInspectionItemRepo.find({
        where: {
          customInspectionFormId,
        },
        relations: [
          'customInspectionItemMedias',
          'customInspectionItemHistories',
        ],
      });
      const customInspectionItemMedias = [];
      for (const item of customInspectionFormItems) {
        if (item.customInspectionItemMedias?.length) {
          for (const customInspectionItemMedia of item.customInspectionItemMedias) {
            customInspectionItemMedias.push(
              customInspectionItemMedia.customInspectionItemMediaId,
            );
          }
        }
      }

      // Remove old data and insert history data
      const customInspectionItemHistories = [];
      for (const item of customInspectionFormItems) {
        for (const customInspectionItemHistory of item.customInspectionItemHistories) {
          customInspectionItemHistories.push(
            customInspectionItemHistory.customInspectionItemHistoryId,
          );
        }
      }

      await customInspectionItemHistoryRepo.delete(
        customInspectionItemHistories,
      );

      await customInspectionItemRepo.delete({
        customInspectionFormId,
      });

      if (customInspectionItemMedias.length) {
        await customInspectionItemMediaRepo.delete(customInspectionItemMedias);
      }

      // Upsert new data
      await customInspectionFormRepo.update(customInspectionFormId, {
        name,
        machineId,
        currentStatus,
        lastStatusUpdatedAt: timeNow,
      });

      const customInspectionFormHistoryId = ulid();
      await customInspectionFormHistoryRepo.insert({
        customInspectionFormHistoryId,
        eventType: EventType.UPDATE,
        eventAt: timeNow,
        actionedByUserId: userId,
        customInspectionFormId,
        name,
        machineId,
        currentStatus,
      });

      await this.processInspectionForm(
        tx,
        userId,
        customInspectionFormId,
        customInspectionFormHistoryId,
        body,
      );
    });

    if (currentStatus === CustomInspectionFormCurrentStatus.PUBLISHED) {
      return {
        data: { customInspectionFormId },
        meta: {
          successMessage: this.i18n.t('message.inspectionForm.publishSuccess', {
            lang: ctx.isoLocaleCode,
          }),
        },
      };
    }

    return {
      data: { customInspectionFormId },
      meta: {},
    };
  }

  private async processInspectionForm(
    tx: EntityManager,
    userId: string,
    customInspectionFormId: string,
    customInspectionFormHistoryId: string,
    body: CreateInspectionFormInput | UpdateInspectionFormInput,
  ) {
    const timeNow = new Date();
    const { currentStatus } = body;
    const customInspectionItemRepo = tx.getRepository(CustomInspectionItem);
    const customInspectionItemHistoryRepo = tx.getRepository(
      CustomInspectionItemHistory,
    );
    const customInspectionItemMediaRepo = tx.getRepository(
      CustomInspectionItemMedia,
    );

    const customInspectionItemHistories = [];
    const customInspectionItemMedias = [];
    const customInspectionItems = (body.customInspectionItems || []).map(
      (item, index) => {
        const customInspectionItemId = ulid();

        customInspectionItemMedias.push(
          ...(item.customInspectionItemMedias || []).map((itemMedia) => ({
            ...itemMedia,
            mediaUrl: itemMedia.filePath,
            customInspectionItemId,
            createdAt: timeNow,
          })),
        );

        customInspectionItemHistories.push({
          ...item,
          customInspectionFormHistoryId,
          eventType: EventType.CREATE,
          eventAt: timeNow,
          actionedByUserId: userId,
          customInspectionItemId,
          currentStatus,
          position: index,
          description: item.description ?? '',
        });

        return {
          ...item,
          customInspectionFormId,
          customInspectionItemId,
          currentStatus,
          lastStatusUpdatedAt: timeNow,
          position: index,
          description: item.description ?? '',
        };
      },
    );

    await customInspectionItemRepo.insert(customInspectionItems);
    await customInspectionItemHistoryRepo.insert(customInspectionItemHistories);
    await customInspectionItemMediaRepo.insert(customInspectionItemMedias);
  }

  async getInspectionItemTemplates(
    ctx: RequestContext,
    params: GroupMachineInspectionItemTemplateParam,
  ): Promise<InspectionFormOutput> {
    this.logger.log(ctx, `${this.getInspectionItemTemplates.name} was called`);
    const { inspectionFormTemplateId } = params;
    const inspectionTemplate =
      await this.inspectionFormTemplateRepository.getInspectionItemTemplates(
        ctx.isoLocaleCode,
        inspectionFormTemplateId,
      );
    if (!inspectionTemplate) {
      throw new NotFoundException({
        errorType: ErrorType.INSPECTION_FORM_TEMPLATE_NOT_FOUND,
        message: 'InspectionFormTemplate not found.',
      });
    }

    return plainToInstance(InspectionFormOutput, {
      inspectionFormId: inspectionFormTemplateId,
      type: InspectionFormType.TEMPLATE,
      name: inspectionTemplate.inspectionFormTemplateTranslations[0]
        .inspectionFormTemplateName,
      inspectionItems: inspectionTemplate.inspectionItemTemplates.map(
        (inspectionItem) => ({
          ...inspectionItem,
          name: inspectionItem.inspectionItemTemplateTranslations[0].itemName,
          description:
            inspectionItem.inspectionItemTemplateTranslations[0]
              .itemDescription,
          isImmutable: inspectionItem.isImmutableItem,
          isForcedRequired: inspectionItem.isForcedRequiredItem,
          isRequired:
            inspectionItem.resultType ===
            CustomInspectionItemResultType.OK_OR_ANOMARY
              ? true
              : inspectionItem.isForcedRequiredItem,
        }),
      ),
    });
  }

  async getInspectionItems(
    ctx: RequestContext,
    params: GroupMachineInspectionFormParam,
  ): Promise<InspectionFormOutput> {
    this.logger.log(ctx, `${this.getInspectionItems.name} was called`);
    const { customInspectionFormId } = params;
    const isoLocaleCode = ctx.isoLocaleCode;

    const inspectionForm =
      await this.customInspectionFormRepository.getInspectionItems(
        customInspectionFormId,
      );

    checkCustomInspectionFormNotFound(inspectionForm, isoLocaleCode, this.i18n);

    return plainToInstance(InspectionFormOutput, {
      ...inspectionForm,
      inspectionFormId: customInspectionFormId,
      type: InspectionFormType.CUSTOM,
      inspectionItems: inspectionForm.customInspectionItems.map(
        (inspectionItem) => ({
          ...inspectionItem,
          inspectionItemId: inspectionItem.customInspectionItemId,
          inspectionItemMedias: inspectionItem.customInspectionItemMedias.map(
            (item) => ({
              ...item,
              filePath: item.mediaUrl,
              mediaUrl: this.storageService.generateSasUrl(item.mediaUrl),
            }),
          ),
        }),
      ),
    });
  }

  async getListUserInspectionDraft(
    ctx: RequestContext,
    params: GroupMachineParam,
  ): Promise<ListUserInspectionDraftsOutput[]> {
    this.logger.log(ctx, `${this.getListUserInspectionDraft.name} was called`);
    const { machineId } = params;
    const listUserInspectionDrafts =
      await this.inspectionRepository.getListUserInspectionDraft(
        machineId,
        ctx.user.userId,
      );

    return plainToInstance(
      ListUserInspectionDraftsOutput,
      listUserInspectionDrafts,
    );
  }

  async getListInspection(
    ctx: RequestContext,
    params: GroupMachineParam,
    query: PaginationInputQuery,
  ): Promise<BaseApiResponse<ListInspectionOutput[]>> {
    this.logger.log(ctx, `${this.getListInspection.name} was called`);

    const { machineId } = params;
    const { limit, page } = query;
    const firstRequestTime = query.firstRequestTime || new Date();
    const offset = limit ? (page - 1) * limit : 0;

    const listInspection = await this.inspectionRepository.getListInspection(
      machineId,
      limit + 1,
      offset,
      dayjs(firstRequestTime).format(dateFormat.dateTimeFormat),
    );
    const isNextPage = listInspection.length > limit;

    return {
      meta: {
        pageInfo: { nextPage: isNextPage, limit, page, firstRequestTime },
      },
      data: plainToInstance(
        ListInspectionOutput,
        isNextPage ? listInspection.slice(0, -1) : listInspection,
      ),
    };
  }

  async getInspectionDetail(
    ctx: RequestContext,
    params: GroupMachineInspectionParam,
  ): Promise<InspectionDetailOutput> {
    this.logger.log(ctx, `${this.getInspectionDetail.name} was called`);

    const inspection = await this.inspectionRepository.getInspectionDetail(
      params.machineId,
      params.inspectionId,
    );

    let odometer = null;
    let serviceMeter = null;
    const inspectionItems = inspection.inspectionResults.map(
      (inspectionResult) => {
        if (inspectionResult.itemCode === ItemCodeType.ODOMETER)
          odometer = formatServiceMeter(inspectionResult.result);
        else if (inspectionResult.itemCode === ItemCodeType.SERVICE_METER)
          serviceMeter = formatServiceMeter(inspectionResult.result);

        const { customInspectionItem, machineReport } = inspectionResult;
        const { customInspectionItemId, customInspectionItemMedias } =
          customInspectionItem;

        return {
          ...inspectionResult,
          ...customInspectionItem,
          result: formatServiceMeter(inspectionResult.result),
          inspectionItemId: customInspectionItemId,
          inspectionItemMedias: customInspectionItemMedias.map((media) => ({
            ...media,
            filePath: media.mediaUrl,
            mediaUrl: this.storageService.generateSasUrl(media.mediaUrl),
            thumbnailUrl: media.mimeType.startsWith(VIDEO_MIME_TYPE)
              ? this.storageService.generateSasUrl(
                  this.storageService.generateThumbnailPath(media.mediaUrl),
                )
              : null,
          })),
          machineReport: machineReport
            ? {
                ...machineReport,
                ...machineReport.firstMachineReportResponse,
                machineReportMedias:
                  machineReport.firstMachineReportResponse.machineReportMedias.map(
                    (media) => ({
                      ...media,
                      filePath: media.mediaUrl,
                      mediaUrl: this.storageService.generateSasUrl(
                        media.mediaUrl,
                      ),
                      thumbnailUrl: media.mimeType.startsWith(VIDEO_MIME_TYPE)
                        ? this.storageService.generateSasUrl(
                            this.storageService.generateThumbnailPath(
                              media.mediaUrl,
                            ),
                          )
                        : null,
                    }),
                  ),
              }
            : null,
        };
      },
    );

    return plainToInstance(InspectionDetailOutput, {
      ...inspection.inspectionHistories[0].user,
      ...inspection,
      odometer,
      serviceMeter,
      pictureUrl: this.storageService.generateSasUrl(
        inspection.inspectionHistories[0].user.pictureUrl,
      ),
      inspectionFormId: inspection.customInspectionForm.customInspectionFormId,
      type: InspectionFormType.INSPECTION,
      name: inspection.customInspectionForm.name,
      inspectionItems,
    });
  }

  async createInspection(
    ctx: RequestContext,
    params: GroupMachineParam,
    input: CreateInspectionInput,
    group: Group,
  ) {
    this.logger.log(ctx, `${this.createInspection.name} was called`);
    const { inspectionFormId } = input;
    const timeNow = new Date();
    const { userId } = ctx.user;
    const { machineId } = params;

    // Check validate
    const customInspectionForm =
      await this.customInspectionFormRepository.findOne({
        where: { customInspectionFormId: inspectionFormId },
      });

    checkCustomInspectionFormNotFound(
      customInspectionForm,
      ctx.isoLocaleCode,
      this.i18n,
      HttpStatus.BAD_REQUEST,
    );

    await this.validateInspectionInput(input, ctx.isoLocaleCode);

    //Handle data
    const inspectionId = ulid();
    const inspectionHistoryId = ulid();
    const inspectionItems = await this.dataSource.transaction(async (tx) => {
      const inspectionRepo = tx.getRepository(Inspection);
      const inspectionHistoryRepo = tx.getRepository(InspectionHistory);

      // Data inspection
      const inspection = inspectionRepo.create({
        ...input,
        inspectionId,
        inspectionAt: timeNow,
        machineId,
        lastStatusUpdatedAt: timeNow,
        customInspectionFormId: inspectionFormId,
      });

      // Data inspectionHistory
      const inspectionHistory = inspectionHistoryRepo.create({
        ...inspection,
        inspectionHistoryId,
        eventType: EventType.CREATE,
        eventAt: timeNow,
        actionedByUserId: userId,
      });

      await inspectionRepo.insert(inspection);
      await inspectionHistoryRepo.insert(inspectionHistory);

      // handleDataInspectionItems
      return this.handleDataInspectionItems(
        tx,
        input,
        userId,
        inspectionId,
        group,
        timeNow,
        inspectionHistoryId,
      );
    });

    //handle push notifications
    if (input.currentStatus === InspectionCurrentStatus.POSTED) {
      this.handlePushNotiForInspection(
        ctx,
        customInspectionForm,
        group,
        inspectionItems,
      );
      return {
        data: {},
        meta: {
          successMessage: this.i18n.t('message.inspection.sendSuccess', {
            lang: ctx.isoLocaleCode,
          }),
        },
      };
    }
    return { data: {}, meta: {} };
  }

  async updateInspection(
    ctx: RequestContext,
    params: InspectionParam,
    input: UpdateInspectionInput,
    group: Group,
  ) {
    this.logger.log(ctx, `${this.updateInspection.name} was called`);
    const { inspectionId } = params;
    const timeNow = new Date();
    const { userId } = ctx.user;

    // Check validate
    await this.validateInspectionInput(input, ctx.isoLocaleCode);

    const inspectionItems = await this.dataSource.transaction(async (tx) => {
      const inspectionRepo = tx.getRepository(Inspection);
      const inspectionHistoryRepo = tx.getRepository(InspectionHistory);
      const inspectionResultRepo = tx.getRepository(InspectionResult);
      const inspectionResultHistoryRepo = tx.getRepository(
        InspectionResultHistory,
      );
      const machineReportRepo = tx.getRepository(MachineReport);
      const machineReportHistoryRepo = tx.getRepository(MachineReportHistory);
      const machineReportResponseRepo = tx.getRepository(MachineReportResponse);
      const machineReportMediaRepo = tx.getRepository(MachineReportMedia);
      const inspectionHistoryId = ulid();

      // Remove draft items and insert history data

      const dataInspectionItems = await inspectionResultRepo.find({
        where: { inspectionId },
        relations: [
          'machineReport',
          'machineReport.machineReportHistories',
          'machineReport.machineReportResponses',
          'machineReport.machineReportResponses.machineReportMedias',
        ],
      });

      const machineReportIds = [];
      const machineReportResponseIds = [];
      const machineReportMediaIds = [];
      const machineReportHistoryIds = [];
      const inspectionResultIds = dataInspectionItems.map((item) => {
        if (item.machineReport) {
          machineReportIds.push(item.machineReport.machineReportId);
          machineReportHistoryIds.push(
            item.machineReport.machineReportHistories[0].machineReportHistoryId,
          );
          machineReportResponseIds.push(
            item.machineReport.machineReportResponses[0]
              .machineReportResponseId,
          );
          const machineReportMediaItems =
            item.machineReport.machineReportResponses[0].machineReportMedias;
          if (machineReportMediaItems?.length) {
            for (const machineReportMedia of machineReportMediaItems) {
              machineReportMediaIds.push(
                machineReportMedia.machineReportMediaId,
              );
            }
          }
        }

        return item.inspectionResultId;
      });

      // Check must have record delete will be call
      if (machineReportMediaIds?.length) {
        await machineReportMediaRepo.delete(machineReportMediaIds);
      }

      if (machineReportIds?.length) {
        await machineReportHistoryRepo.delete(machineReportHistoryIds);
        await machineReportResponseRepo.delete(machineReportResponseIds);
        await machineReportRepo.delete(machineReportIds);
      }

      await inspectionResultHistoryRepo.delete({
        inspectionResultId: In(inspectionResultIds),
      });
      await inspectionResultRepo.delete(inspectionResultIds);

      // Update data
      // Data inspection
      const inspection = inspectionRepo.create({
        ...group.machines[0].inspections[0],
        ...input,
        inspectionAt: timeNow,
        lastStatusUpdatedAt: timeNow,
      });

      // Data inspectionHistory
      const inspectionHistory = inspectionHistoryRepo.create({
        ...inspection,
        inspectionHistoryId,
        eventType: EventType.UPDATE,
        eventAt: timeNow,
        actionedByUserId: userId,
      });
      await inspectionRepo.update(inspectionId, inspection);
      await inspectionHistoryRepo.insert(inspectionHistory);

      // handleDataInspectionItems
      return this.handleDataInspectionItems(
        tx,
        input,
        userId,
        inspectionId,
        group,
        timeNow,
        inspectionHistoryId,
      );
    });

    //handle push notifications
    if (input.currentStatus === InspectionCurrentStatus.POSTED) {
      const customInspectionForm =
        await this.customInspectionFormRepository.findOne({
          where: { customInspectionFormId: input.inspectionFormId },
        });

      this.handlePushNotiForInspection(
        ctx,
        customInspectionForm,
        group,
        inspectionItems,
      );

      return {
        data: {},
        meta: {
          successMessage: this.i18n.t('message.inspection.sendSuccess', {
            lang: ctx.isoLocaleCode,
          }),
        },
      };
    }
    return { data: {}, meta: {} };
  }

  private async handleDataInspectionItems(
    tx: EntityManager,
    input:
      | CreateInspectionInput
      | UpdateInspectionInput
      | SyncInspectionDataInput,
    userId: string,
    inspectionId: string,
    group: Group,
    timeNow: Date,
    inspectionHistoryId: string,
    isSync: boolean = false,
  ) {
    const { machineId, lastServiceMeterUpdatedAt } = group.machines[0];

    const { currentStatus, lat, lng, locationAccuracy, devicePlatform } = input;

    const inspectionResultRepo = tx.getRepository(InspectionResult);
    const inspectionResultHistoryRepo = tx.getRepository(
      InspectionResultHistory,
    );
    const machineReportRepo = tx.getRepository(MachineReport);
    const machineReportHistoryRepo = tx.getRepository(MachineReportHistory);
    const machineReportResponseRepo = tx.getRepository(MachineReportResponse);
    const machineReportMediaRepo = tx.getRepository(MachineReportMedia);
    const machineReportUserReadRepo = tx.getRepository(MachineReportUserRead);
    const machineRepo = tx.getRepository(Machine);

    const inspectionResultHistories = [];
    const machineReports = [];
    const machineReportHistories = [];
    const machineReportResponses = [];
    const machineReportMedias = [];
    const machineReportIds = [];
    const machineReportResponseIds = [];
    const machineReportUserReads = [];
    const { result: serviceMeter } = input.inspectionItems.find(
      ({ itemCode }) => itemCode === ItemCodeType.SERVICE_METER,
    );
    const inspectionItems = input.inspectionItems.map(
      (inspectionItem: Record<string, any>) => {
        const inspectionResultId = isSync
          ? inspectionItem.inspectionResultId
          : ulid();
        const customInspectionItemId = inspectionItem.inspectionItemId;

        // Data inspectionResult
        const inspectionResult = inspectionResultRepo.create({
          ...inspectionItem,
          result: formatServiceMeter(inspectionItem.result),
          inspectionResultId,
          inspectionId,
          customInspectionItemId,
          currentStatus,
          lastStatusUpdatedAt: timeNow,
        });

        // Data inspectionResultHistory
        inspectionResultHistories.push(
          inspectionResultHistoryRepo.create({
            ...inspectionResult,
            inspectionHistoryId,
            inspectionResultHistoryId: ulid(),
            eventType: EventType.CREATE,
            eventAt: timeNow,
            actionedByUserId: userId,
          }),
        );

        if (inspectionItem.machineReport) {
          const machineReportId = isSync
            ? inspectionItem.machineReport.machineReportId
            : ulid();
          machineReportIds.push(machineReportId);
          const machineReportResponseId = isSync
            ? inspectionItem.machineReport.machineReportResponseId
            : ulid();
          machineReportResponseIds.push(machineReportResponseId);
          const machineReport = machineReportRepo.create({
            ...inspectionItem.machineReport,
            inspectionResultId,
            machineReportId,
            machineId,
            firstMachineReportResponseId: machineReportResponseId,
            lastMachineReportResponseId: machineReportResponseId,
            currentStatus:
              currentStatus === InspectionCurrentStatus.DRAFT
                ? MachineReportCurrentStatus.DRAFT
                : MachineReportCurrentStatus.POSTED,
            lastStatusUpdatedAt: timeNow,
          });

          const dataMachineReportMedias =
            inspectionItem.machineReport.machineReportMedias;

          // Data machineReport
          machineReports.push(machineReport);

          // Data machineReportUserRead
          machineReportUserReads.push(
            machineReportUserReadRepo.create({
              userId,
              machineReportId,
              readAt: timeNow,
            }),
          );

          // Data machineReportHistory
          machineReportHistories.push({
            ...machineReport,
            machineReportHistoryId: ulid(),
            eventType: EventType.CREATE,
            eventAt: timeNow,
            actionedByUserId: userId,
          });

          // Data machineReportResponses
          machineReportResponses.push({
            ...inspectionItem.machineReport,
            reportComment: inspectionItem.machineReport.reportComment ?? '',
            machineReportResponseId,
            commentedAt: timeNow,
            machineReportId,
            userId,
            lat,
            lng,
            locationAccuracy,
            devicePlatform,
            status: MachineReportResponseStatus.UNADDRESSED,
            subtype: Subtype.INCIDENT_REPORTS,
            serviceMeterInHour: transformStringNumber(serviceMeter),
          });

          // Check if already upload inspection images
          if (dataMachineReportMedias?.length) {
            for (const machineReportMedia of dataMachineReportMedias) {
              machineReportMedias.push({
                ...machineReportMedia,
                mediaUrl:
                  machineReportMedia.filePath || machineReportMedia.mediaUrl,
                machineReportMediaId: isSync
                  ? dataMachineReportMedias.machineReportMediaId
                  : ulid(),
                machineReportResponseId,
                createdAt: timeNow,
              });
            }
          }
        }

        return inspectionResult;
      },
    );

    if (input.currentStatus === InspectionCurrentStatus.POSTED) {
      if (isSync) {
        const { lastStatusUpdatedAt } = input as SyncInspectionDataInput;
        if (
          !lastServiceMeterUpdatedAt ||
          lastServiceMeterUpdatedAt <= lastStatusUpdatedAt
        ) {
          await machineRepo.update(machineId, {
            lastServiceMeter: formatServiceMeter(serviceMeter),
            lastServiceMeterUpdatedAt: lastStatusUpdatedAt,
          });
        }
      } else {
        await machineRepo.update(machineId, {
          lastServiceMeter: formatServiceMeter(serviceMeter),
          lastServiceMeterUpdatedAt: timeNow,
        });
      }
    }
    await inspectionResultRepo.insert(inspectionItems);
    await inspectionResultHistoryRepo.insert(inspectionResultHistories);
    await machineReportRepo.insert(machineReports);
    await machineReportHistoryRepo.insert(machineReportHistories);
    await machineReportResponseRepo.insert(machineReportResponses);
    await machineReportMediaRepo.insert(machineReportMedias);
    await machineReportUserReadRepo.insert(machineReportUserReads);

    return { inspectionId, machineReportIds, machineReportResponseIds };
  }

  private async validateInspectionInput(
    input: CreateInspectionInput | UpdateInspectionInput,
    isoLocaleCode: ISOLocaleCode,
  ) {
    const customInspectionItems =
      await this.customInspectionItemRepository.find({
        where: {
          customInspectionFormId: input.inspectionFormId,
          currentStatus: Not(CustomInspectionFormCurrentStatus.DRAFT),
        },
      });

    if (customInspectionItems.length !== input.inspectionItems.length) {
      throw new BadRequestException(
        'inspectionItem not found in inspectionForm.',
      );
    }

    const itemMap = new Map<string, CustomInspectionItem>(
      customInspectionItems.map((item) => [item.customInspectionItemId, item]),
    );

    for (const inspectionResult of input.inspectionItems) {
      const { result, machineReport, inspectionItemId, resultType, itemCode } =
        inspectionResult;
      const inspectionItem = itemMap.get(inspectionItemId);

      if (!inspectionItem) {
        throw new BadRequestException('inspectionItem input not valid.');
      }
      if (
        resultType !== inspectionItem.resultType ||
        (inspectionItem.itemCode && itemCode !== inspectionItem.itemCode)
      ) {
        throw new BadRequestException(
          'isRequired or resultType or itemCode input wrong.',
        );
      }
      // Check result must match resultType
      this.validateResultInspectionValue(
        result,
        resultType,
        machineReport,
        itemCode,
        isoLocaleCode,
      );
      // Check in case change status to `POSTED`
      if (input.currentStatus === InspectionCurrentStatus.POSTED) {
        // When `result` is `ANOMARY` must input machineReport
        if (result === InspectionResultType.ANOMARY && !machineReport) {
          throw new BadRequestException(
            'Input machine report when result have value ANOMARY',
          );
        }

        // Must input at least one field of machine report info
        if (
          machineReport &&
          !machineReport.reportComment &&
          !machineReport.machineReportMedias?.length
        ) {
          throw new BadRequestException(
            'The machine report response input must have at least one field.',
          );
        }

        // Require result value of each item
        if (!result?.length && inspectionItem.isRequired) {
          throw new BadRequestException(
            'Result must be greater than 1 characters.',
          );
        }
      }
    }
  }

  private validateResultInspectionValue(
    result: string,
    resultType: string,
    machineReport: MachineReportInput,
    itemCode: string,
    isoLocaleCode: ISOLocaleCode,
  ) {
    if (result?.length) {
      if (resultType === CustomInspectionItemResultType.NUMERIC) {
        if (!isNumberString(result)) {
          throw new BadRequestException(
            'Result must match result type NUMERIC',
          );
        }
        if (!isEnum(itemCode, ItemCodeType)) {
          throw new BadRequestException(
            'item code must match result type NUMERIC',
          );
        }
        if (
          itemCode === ItemCodeType.SERVICE_METER &&
          !SERVICE_METER_REGEX.test(result)
        ) {
          throw new BadRequestException({
            customMessage: this.i18n.t(
              'message.inspection.result.serviceMeter',
              {
                lang: isoLocaleCode,
              },
            ),
          });
        }
        if (!ODOMETER_REGEX.test(result)) {
          throw new BadRequestException({
            customMessage: this.i18n.t('message.inspection.result.odometer', {
              lang: isoLocaleCode,
            }),
          });
        }
      }

      if (
        resultType === CustomInspectionItemResultType.OK_OR_ANOMARY &&
        !isEnum(result, InspectionResultType)
      ) {
        throw new BadRequestException(
          'Result must match result type OK_OR_ANOMARY',
        );
      }

      // Check if `result` is `OK` -> not input machine report
      if (result === InspectionResultType.OK && machineReport) {
        throw new BadRequestException(
          'Not input machine report when result OK',
        );
      }
    }
  }

  async handlePushNotiForInspection(
    ctx: RequestContext,
    customInspectionForm: CustomInspectionForm,
    group: Group,
    inspectionItems: Record<string, any>,
  ) {
    try {
      const { userId, surname, givenName } = ctx.user;
      const { customInspectionFormId, name: customInspectionFormName } =
        customInspectionForm;
      const {
        groupId,
        groupName,
        machines: [{ machineId, machineName }],
      } = group;
      const { inspectionId, machineReportIds, machineReportResponseIds } =
        inspectionItems;

      const data: ContentDataNotification = {
        actionByUserId: userId,
        givenName,
        surname,
        groupId,
        groupName,
        machineId,
        customerMachineName: machineName,
        customInspectionFormId,
        customInspectionFormName,
        inspectionId,
      };

      const userInspectionTokens =
        await this.userRepository.getUserDevicesInGroup(groupId, userId, true);

      if (userInspectionTokens?.length) {
        const groupDevices = groupDeviceUsersByLocaleCode(userInspectionTokens);

        // Push notification for inspection
        await this.firebaseService.sendNotificationsByLocalCode(
          ctx,
          groupDevices,
          data,
          'message.firebaseMessages.registeredInspection',
          NotificationContentCode.INSPECTION_POSTED,
        );
      }

      // Push notifications for machine report if any
      if (machineReportIds?.length) {
        const userReportTokens =
          await this.userRepository.getUserDevicesInGroup(
            groupId,
            userId,
            false,
            true,
          );

        if (userReportTokens?.length) {
          for (let i = 0; i < machineReportIds.length; i++) {
            const dataReports = {
              ...data,
              machineReportId: machineReportIds[i],
              machineReportResponseId: machineReportResponseIds[i],
            };
            const groupDevices = groupDeviceUsersByLocaleCode(userReportTokens);

            await this.firebaseService.sendNotificationsByLocalCode(
              ctx,
              groupDevices,
              dataReports,
              'message.firebaseMessages.registeredReport',
              NotificationContentCode.INCIDENT_REPORT_POSTED,
            );
          }
        }
      }
    } catch (error) {
      this.logger.error(
        ctx,
        'Error when push notification for inspection or relation reports.',
        { error },
      );
    }
  }

  async updateInspectionFormName(
    name: string,
    customInspectionForm: CustomInspectionForm,
  ) {
    const timeNow = new Date();
    await this.customInspectionFormRepository.update(
      customInspectionForm.customInspectionFormId,
      {
        name,
        lastStatusUpdatedAt: timeNow,
      },
    );
  }

  async generateInspectionPdf(
    ctx: RequestContext,
    params: GroupMachineParam,
    query: GetInspectionQuery,
  ) {
    this.logger.log(ctx, `${this.updateInspection.name} was called`);

    const isoLocaleCode = ctx.isoLocaleCode;
    const { groupId, machineId } = params;
    const { monthYear, customInspectionFormId } = query;
    const [year, month] = monthYear.split('-');

    const [inspectionForm, inspectionList] = await Promise.all([
      this.customInspectionFormRepository.getInspectionForm(
        groupId,
        machineId,
        customInspectionFormId,
        isoLocaleCode,
      ),
      this.getInspectionsForWebapp(ctx, params, query),
    ]);

    const dataByDates = {};
    inspectionList.data.customInspections.forEach((form) => {
      const dateObject = dayjs(form.inspectionAt);
      const date = dateObject.format('D');
      dataByDates[date] ??= {
        inspectionItems: [],
      };

      let reporter = `\u202A${form.surname}\u202C \u202A${form.givenName}\u202C`;
      if (isAlphabetReporter(form.givenName, form.surname)) {
        reporter = `${form.surname.charAt(0)}.${form.givenName}`;
      }

      dataByDates[date].inspectionItems.push({
        time: formatTime(dateObject),
        reporter: reporter,
        results: form.inspectionResults.reduce((acc, curr) => {
          acc[curr.customInspectionItemId] = curr.result;
          return acc;
        }, {}),
      });
    });

    const inspectionTitles = inspectionList.data.customInspectionItems.map(
      (item) => [item.customInspectionItemId, item.name],
    );

    const header = generateHeader(
      year,
      month,
      inspectionForm,
      isoLocaleCode,
      this.i18n,
    );

    const daysInMonth = dayjs(monthYear).endOf('M').get('D');
    const tables = this.generateTable(
      inspectionTitles,
      dataByDates,
      1,
      daysInMonth,
      isoLocaleCode,
    );

    // read html file to pass to puppeteer
    const html = fs.readFileSync(
      join(process.cwd(), './templates/inspection.html'),
      'utf-8',
    );

    const browser = await puppeteer.launch({
      headless: 'new',
      timeout: 60000,
      args: ['--enable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    await page.evaluate(
      (header, tables) => {
        const headerElement = document.getElementById(
          'header-inspection-detail',
        );
        const tableElement = document.getElementById('check-inspection-detail');
        if (tableElement) {
          headerElement.innerHTML += header;
          tableElement.innerHTML += tables;
        } else {
          this.logger.log(ctx, 'Element not found');
        }
      },
      header,
      tables,
    );
    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    const options = {
      landscape: true,
      printBackground: true,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
    };
    const pdfBuffer = await page.pdf(options);

    await browser.close();

    return pdfBuffer;
  }

  generateTable(
    inspectionTitles: string[][],
    dataByDates: Record<string, any>,
    startDate: number,
    endDate: number,
    isoLocaleCode: string,
  ): string {
    const dateHeader = this.generateDateHeader(dataByDates, startDate, endDate);
    const rowsByHeaderAndTitle = this.generateTitleRow(
      inspectionTitles,
      dataByDates,
      dateHeader,
      startDate,
      endDate,
    );

    return generateTable(
      dateHeader,
      rowsByHeaderAndTitle,
      isoLocaleCode,
      this.i18n,
    );
  }

  generateDateHeader(
    dataByDates: Record<string, any>,
    startDate: number,
    endDate: number,
  ) {
    const dateHeaderStrGroupByTable = [];
    const timeHeaderStrGroupByTable = [];
    const reporterRowStrGroupByTable = [];
    const emptyTimeObj = { reporter: '', inspectionItems: [{ time: '' }] };
    let tmpTableDateHeader = '';
    let tmpTableTimeHeader = '';
    let tmpTableReporterRow = '';
    let numOfTableByHeader = 0;
    let currentNumCol = 0;

    for (let date = startDate; date <= endDate; date++) {
      const timesInDate = dataByDates[date] || emptyTimeObj;
      let numOfColspan = 0;
      let numOfTime = timesInDate.inspectionItems.length;
      for (const timeObj of timesInDate.inspectionItems) {
        tmpTableTimeHeader += timeHeader(timeObj.time);
        tmpTableReporterRow += reporter(timeObj.reporter);
        currentNumCol++;
        numOfColspan++;
        numOfTime--;

        if (
          currentNumCol === MAX_COLUMNS_PER_PAGE ||
          (date === endDate && numOfTime === 0)
        ) {
          tmpTableDateHeader += dateHeader(numOfColspan, date);
          // if the page is last page, and number of page is greater than 1, and num of column of this is less than MAX_COLUMNS_PER_PAGE,
          // then we will generate empty columns for enough MAX_COLUMNS_PER_PAGE
          const data = this.handleDateTimeColHidden(
            dateHeaderStrGroupByTable,
            currentNumCol,
            tmpTableTimeHeader,
            tmpTableReporterRow,
            tmpTableDateHeader,
          );
          dateHeaderStrGroupByTable.push(data.tmpTableDateHeader);
          timeHeaderStrGroupByTable.push(data.tmpTableTimeHeader);
          reporterRowStrGroupByTable.push(data.tmpTableReporterRow);
          numOfTableByHeader++;
          numOfColspan = 0;
          currentNumCol = 0;
          tmpTableTimeHeader = '';
          tmpTableReporterRow = '';
          tmpTableDateHeader = '';
        }
      }

      // handle in case date which have times exist in more tables.
      if (numOfColspan > 0) {
        tmpTableDateHeader += dateHeader(numOfColspan, date);
      }
    }

    return {
      dateHeaderStrGroupByTable,
      timeHeaderStrGroupByTable,
      reporterRowStrGroupByTable,
      numOfTableByHeader,
    };
  }

  handleDateTimeColHidden(
    dateHeaderStrGroupByTable: any[],
    currentNumCol: number,
    tmpTableTimeHeader: string,
    tmpTableReporterRow: string,
    tmpTableDateHeader: string,
  ) {
    if (
      dateHeaderStrGroupByTable.length > 0 &&
      currentNumCol < MAX_COLUMNS_PER_PAGE
    ) {
      const hiddenCol = MAX_COLUMNS_PER_PAGE - currentNumCol;
      for (let i = 0; i < hiddenCol; i++) {
        tmpTableTimeHeader += `<th class="time-cell hidden-cell"></th>`;
        tmpTableReporterRow += `<td class="check-detail-cell meter hidden-cell"></td>`;
      }
      tmpTableDateHeader += dateHeader(hiddenCol, '');
    }

    return {
      tmpTableTimeHeader,
      tmpTableReporterRow,
      tmpTableDateHeader,
    };
  }

  generateTitleRow(
    inspectionTitles: string[][],
    dataByDates: Record<string, any>,
    dateHeader: Record<string, any>,
    startDate: number,
    endDate: number,
  ) {
    const rowsByHeaderAndTitle = Array.from(
      { length: dateHeader.numOfTableByHeader },
      () => [''],
    );
    for (const inspectionTitle of inspectionTitles) {
      const rowsGroupByHeader = this.inspectionHistoryByTitle(
        inspectionTitle,
        dataByDates,
        startDate,
        endDate,
      );
      rowsGroupByHeader.forEach((item, tableByHeaderIndex) => {
        rowsByHeaderAndTitle[tableByHeaderIndex] =
          rowsByHeaderAndTitle[tableByHeaderIndex] === undefined
            ? item
            : rowsByHeaderAndTitle[tableByHeaderIndex] + item;
      });
    }

    return rowsByHeaderAndTitle;
  }

  inspectionHistoryByTitle(
    inspectionItem: string[],
    dataByDates: any,
    startDate: number,
    endDate: number,
  ) {
    let currentNumCol = 0;
    const emptyTimeObj = {
      reporter: '',
      inspectionItems: [{ time: '', result: [] }],
    };
    let row = '';
    const [itemId, itemName] = inspectionItem;
    const rowsGroupByHeader = [];
    for (let date = startDate; date <= endDate; date++) {
      const dataByDate = dataByDates[date] || emptyTimeObj;
      let numOfTime = dataByDate.inspectionItems.length;
      for (const item of dataByDate.inspectionItems) {
        currentNumCol++;
        numOfTime--;
        let result = item.results?.[itemId] || '';
        switch (result) {
          case InspectionResultType.OK:
            result = inspectionResultType.resultOk;
            break;
          case InspectionResultType.ANOMARY:
            result = inspectionResultType.resultAnomary;
            break;
        }
        row += generationResult(result);
        if (
          currentNumCol === MAX_COLUMNS_PER_PAGE ||
          (date === endDate && numOfTime === 0)
        ) {
          // When the number of cols(currentNumCol) has reached the maximum, that row has been generated for the current table
          // and added that row to rowsGroupByHeader, continue to create rows from scratch for the next table and repeat until date = end date.

          // if the page is last page, and number of page is greater than 1, and num of column of this is less than MAX_COLUMNS_PER_PAGE,
          // then we will generate empty columns for enough MAX_COLUMNS_PER_PAGE
          const rows = this.handleHistoryByTypeHidden(
            rowsGroupByHeader,
            currentNumCol,
            row,
          );
          const completedRow = detailRowByTitle(itemName, rows);
          rowsGroupByHeader.push(completedRow);
          currentNumCol = 0;
          row = '';
        }
      }
    }

    return rowsGroupByHeader;
  }

  handleHistoryByTypeHidden(
    rowsGroupByHeader: any[],
    currentNumCol: number,
    row: string,
  ) {
    if (rowsGroupByHeader.length > 0 && currentNumCol < MAX_COLUMNS_PER_PAGE) {
      const hiddenCol = MAX_COLUMNS_PER_PAGE - currentNumCol;
      for (let i = 0; i < hiddenCol; i++) {
        row += `<td class="check-detail-cell meter hidden-cell"></td>`;
      }
    }

    return row;
  }

  async syncInspectionData(
    group: Group,
    ctx: RequestContext,
    params: GroupMachineParam,
    input: SyncInspectionDataInput,
  ): Promise<BaseApiResponse<SyncInspectionDataOutput>> {
    this.logger.log(ctx, `${this.syncInspectionData.name} was called`);
    const { inspectionFormId, inspectionId, lastStatusUpdatedAt } = input;
    const { machineId } = params;
    const {
      user: { userId },
      isoLocaleCode,
    } = ctx;

    // Check validate
    const customInspectionForm =
      await this.customInspectionFormRepository.findOne({
        where: { customInspectionFormId: inspectionFormId },
      });

    checkCustomInspectionFormNotFound(
      customInspectionForm,
      isoLocaleCode,
      this.i18n,
      HttpStatus.BAD_REQUEST,
    );

    await this.validateInspectionInput(input, isoLocaleCode);

    //Handle data
    const inspectionHistoryId = ulid();
    let inspectionItems;
    try {
      inspectionItems = await this.dataSource.transaction(async (tx) => {
        const inspectionRepo = tx.getRepository(Inspection);
        const inspectionHistoryRepo = tx.getRepository(InspectionHistory);

        // Data inspection
        const inspection = inspectionRepo.create({
          ...input,
          inspectionId,
          inspectionAt: lastStatusUpdatedAt,
          machineId,
          lastStatusUpdatedAt,
          customInspectionFormId: inspectionFormId,
        });

        // Data inspectionHistory
        const inspectionHistory = inspectionHistoryRepo.create({
          ...inspection,
          inspectionHistoryId,
          eventType: EventType.CREATE,
          eventAt: lastStatusUpdatedAt,
          actionedByUserId: userId,
        });

        await inspectionRepo.insert(inspection);
        await inspectionHistoryRepo.insert(inspectionHistory);

        // handleDataInspectionItems
        return this.handleDataInspectionItems(
          tx,
          input,
          userId,
          inspectionId,
          group,
          lastStatusUpdatedAt,
          inspectionHistoryId,
          true,
        );
      });
    } catch (error) {
      const duplicateErrorCode = 'Error: Violation of PRIMARY KEY';
      if (error.message.includes(duplicateErrorCode)) {
        this.logger.error(ctx, error.message, { error });
        return {
          data: { inspectionId, syncStatus: StatusName.SYNCED },
          meta: {},
        };
      }
      throw error;
    }
    //handle push notifications
    if (
      input.currentStatus === InspectionCurrentStatus.POSTED &&
      group.currentStatus !== GroupCurrentStatus.DELETED &&
      group.machines[0].currentStatus !== MachineCurrentStatus.DELETED
    ) {
      this.handlePushNotiForInspection(
        ctx,
        customInspectionForm,
        group,
        inspectionItems,
      );
      return {
        data: { inspectionId, syncStatus: StatusName.SYNCED },
        meta: {
          successMessage: this.i18n.t('message.inspection.sendSuccess', {
            lang: isoLocaleCode,
          }),
        },
      };
    }
    return {
      data: { inspectionId, syncStatus: StatusName.SYNCED },
      meta: {},
    };
  }

  async getInspectionsForWebapp(
    ctx: RequestContext,
    params: GroupMachineParam,
    query: GetInspectionQuery,
  ): Promise<BaseApiResponse<GetInspectionsForWebappOutput>> {
    this.logger.log(ctx, `${this.getInspectionsForWebapp.name} was called`);

    const { machineId } = params;
    const { monthYear, customInspectionFormId, utc } = query;

    const startTime = dayjs(monthYear).startOf('M');
    const endTime = dayjs(monthYear).endOf('M');

    const [inspections, customInspectionForm] = await Promise.all([
      this.inspectionRepository.getInspectionsForWebapp(
        convertTimezoneToUTC(startTime, utc),
        convertTimezoneToUTC(endTime, utc),
        customInspectionFormId,
        machineId,
      ),
      this.customInspectionFormRepository.getCustomInspectionForm(
        customInspectionFormId,
        machineId,
      ),
    ]);

    checkCustomInspectionFormNotFound(
      customInspectionForm,
      ctx.isoLocaleCode,
      this.i18n,
      HttpStatus.BAD_REQUEST,
    );

    return {
      meta: {},
      data: plainToInstance(GetInspectionsForWebappOutput, {
        customInspectionItems: customInspectionForm?.customInspectionItems,
        customInspections: inspections.map((inspection) => ({
          ...inspection.inspectionHistories[0].user,
          ...inspection,
          userPictureUrl: this.storageService.generateSasUrl(
            inspection.inspectionHistories[0].user.pictureUrl,
          ),
          inspectionAt: convertUTCToTimezone(
            dayjs(inspection.inspectionAt),
            utc,
          ),
          inspectionResults: inspection.inspectionResults.map((item) => ({
            ...item,
            result: formatServiceMeter(item.result),
          })),
        })),
      }),
    };
  }
}
