import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class SerialNumberOutput {
  @ApiProperty()
  @Expose()
  manufacturer: string;

  @ApiProperty()
  @Expose()
  machineType: string;

  @ApiProperty()
  @Expose()
  regex: string;

  @ApiProperty(defaultExamples.message)
  @Expose()
  message: Record<string, string>;

  @ApiProperty()
  @Expose()
  maxLength: number;

  @ApiProperty()
  @Expose()
  uppercase: boolean;

  @ApiProperty()
  @Expose()
  type: string;
}
