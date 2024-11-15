import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class GenerateUploadUrlOutput {
  @ApiProperty({
    description: 'Full path used to upload image to blob storage.',
    example: 'http://example.com/folder/image-path?sv=2018-11-09&se=2022-11-10',
  })
  @Expose()
  @IsString()
  sasUrl: string;

  @ApiProperty({
    description: 'Image path used to store in the database.',
    example: '/image-path/imagename.png',
  })
  @Expose()
  @IsString()
  filePath: string;
}
