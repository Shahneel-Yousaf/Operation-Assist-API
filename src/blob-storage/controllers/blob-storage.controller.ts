import {
  GenerateUploadUrlInput,
  GenerateUploadUrlOutput,
  GenerateVideoUploadUrlInput,
  GenerateVideoUploadUrlOutput,
} from '@blob-storage/dtos';
import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MiddlewareEnum } from '@shared/constants';
import { MiddlewareException } from '@shared/decorators/middlewares-exception.decorator';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { ReqContext } from '@shared/request-context/req-context.decorator';
import { RequestContext } from '@shared/request-context/request-context.dto';

@ApiTags('blob-storage')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: BaseApiErrorResponse })
@ApiNotFoundResponse({ type: BaseApiErrorResponse })
@ApiInternalServerErrorResponse({ type: BaseApiErrorResponse })
@Controller('blob-storage')
export class BlobStorageController {
  constructor(
    private readonly groupService: BlobStorageService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(BlobStorageController.name);
  }

  @Post('generate-upload-url')
  @ApiOperation({ summary: 'Create SAS upload URL API' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(GenerateUploadUrlOutput) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @MiddlewareException([MiddlewareEnum.PERMISSION_INTERCEPTOR])
  generateUploadUrl(
    @ReqContext() ctx: RequestContext,
    @Body() generateUploadUrlInput: GenerateUploadUrlInput,
  ): BaseApiResponse<GenerateUploadUrlOutput> {
    this.logger.log(ctx, `${this.generateUploadUrl.name} was called`);

    const sasUrl = this.groupService.generateUploadUrl(
      ctx,
      generateUploadUrlInput,
    );

    return {
      data: sasUrl,
      meta: {},
    };
  }

  @Post('generate-video-upload-urls')
  @ApiOperation({ summary: 'Generate upload url for video' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(GenerateVideoUploadUrlOutput) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @MiddlewareException([MiddlewareEnum.PERMISSION_INTERCEPTOR])
  generateVideoUploadUrl(
    @ReqContext() ctx: RequestContext,
    @Body() generateVideoUploadUrlInput: GenerateVideoUploadUrlInput,
  ): BaseApiResponse<GenerateVideoUploadUrlOutput> {
    this.logger.log(ctx, `${this.generateVideoUploadUrl.name} was called`);

    const data = this.groupService.generateVideoUploadUrl(
      ctx,
      generateVideoUploadUrlInput,
    );

    return {
      data: data,
      meta: {},
    };
  }
}
