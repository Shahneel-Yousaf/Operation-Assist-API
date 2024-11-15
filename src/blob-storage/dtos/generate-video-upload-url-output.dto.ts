import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class GenerateVideoUploadUrlOutput {
  @ApiProperty({
    description: 'Full path used to upload video to blob storage.',
    example: 'http://example.com/folder/video-path?sv=2018-11-09&se=2022-11-10',
  })
  @Expose()
  @IsString()
  sasUrl: string;

  @ApiProperty({
    description: 'Video path used to store in the database.',
    example: '/video-path/videoname.png',
  })
  @Expose()
  @IsString()
  filePath: string;

  @ApiProperty({
    description: 'Full path used to upload thumbnail to blob storage.',
    example:
      'http://example.com/thumbnails/video-path?sv=2018-11-09&se=2022-11-10',
  })
  @Expose()
  @IsString()
  thumbnailSasUrl: string;
}
