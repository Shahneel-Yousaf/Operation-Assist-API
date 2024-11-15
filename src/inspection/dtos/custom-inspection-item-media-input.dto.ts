import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CustomInspectionItemMediaInput {
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  fileName: string;

  @ApiProperty()
  @IsString()
  @Length(1, 512)
  filePath: string;

  @ApiProperty()
  @IsString()
  @Length(1, 64)
  mimeType: string;
}
