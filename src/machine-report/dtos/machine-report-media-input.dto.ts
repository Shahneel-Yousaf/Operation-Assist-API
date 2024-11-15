import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, ValidateIf } from 'class-validator';

export class MachineReportMediaInput {
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  fileName: string;

  @ApiPropertyOptional()
  @ValidateIf((req) => !req.filePath || req.mediaUrl)
  @IsString()
  @Length(0, 512)
  mediaUrl: string;

  @ApiPropertyOptional()
  @ValidateIf((req) => !req.mediaUrl || req.filePath)
  @IsString()
  @Length(0, 512)
  filePath: string;

  @ApiProperty()
  @IsString()
  @Length(1, 64)
  mimeType: string;
}
