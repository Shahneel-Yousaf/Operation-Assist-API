import { ApiProperty } from '@nestjs/swagger';
import {
  EMOJI_REGEX,
  INVALID_CHARACTER_REGEX,
  UploadFileType,
} from '@shared/constants';
import { RegexMatches, RegexNotMatches } from '@shared/validations';
import { IsEnum, IsString } from 'class-validator';

export class GenerateUploadUrlInput {
  @ApiProperty({
    description: 'Content type of image.',
    enum: UploadFileType,
    example: UploadFileType.USER,
  })
  @IsString()
  @IsEnum(UploadFileType)
  type: UploadFileType;

  @ApiProperty({
    description: 'Name of the uploaded image.',
    example: 'image-name.png',
  })
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  @IsString()
  fileName: string;
}
