import { ApiProperty } from '@nestjs/swagger';
import {
  EMOJI_REGEX,
  INVALID_CHARACTER_REGEX,
  UploadFileType,
} from '@shared/constants';
import { RegexMatches, RegexNotMatches } from '@shared/validations';
import { IsEnum, IsString } from 'class-validator';

export class GenerateVideoUploadUrlInput {
  @ApiProperty({
    description: 'Content type of video.',
    enum: UploadFileType,
    example: UploadFileType.USER,
  })
  @IsString()
  @IsEnum(UploadFileType)
  type: UploadFileType;

  @ApiProperty({
    description: 'Name of the uploaded video.',
    example: 'video-name.mov',
  })
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  @IsString()
  fileName: string;
}
