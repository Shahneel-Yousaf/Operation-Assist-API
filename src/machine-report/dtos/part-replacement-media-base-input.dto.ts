import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class PartReplacementMediaBaseInput {
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  fileName: string;

  @ApiPropertyOptional()
  @IsString()
  @Length(0, 512)
  mediaUrl: string;

  @ApiProperty()
  @IsString()
  @Length(1, 64)
  mimeType: string;
}
