import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';

import { configModuleOptions } from './configs/module-options';
import { ISOLocaleCode } from './constants';
import { AppLoggerModule } from './logger/logger.module';
import { AllEntitySubscriber } from './typeorm/all-entity-subscriber';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mssql',
        url: configService.get<string>('database.masterUrl'),
        entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
        timezone: 'Z',
        synchronize: false,
        autoLoadEntities: true,
        debug: configService.get<string>('env') === 'development',
        subscribers: [AllEntitySubscriber],
        extra: {
          trustServerCertificate: true,
        },
        logging: configService.get<string>('env') === 'local',
        requestTimeout: +configService.get<number>('database.requestTimeout'),
        connectionTimeout: +configService.get<number>(
          'database.connectionTimeout',
        ),
      }),
    }),
    AppLoggerModule,
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: ISOLocaleCode.EN,
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    CacheModule.register(),
  ],
  exports: [AppLoggerModule, ConfigModule, CacheModule],
})
export class SharedModule {}
