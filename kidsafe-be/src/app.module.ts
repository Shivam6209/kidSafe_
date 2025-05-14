import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ActivityModule } from './activity/activity.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'schoolmangement-systemmangment9-b98a.i.aivencloud.com',
      port: parseInt(process.env.DB_PORT) || 18602,
      username: process.env.DB_USERNAME || 'avnadmin',
      password: process.env.DB_PASSWORD || 'AVNS_ifSsh2u201w0A7qUb5U',
      database: process.env.DB_DATABASE || 'kidSafe',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    SharedModule,
    AuthModule,
    ProfileModule,
    DashboardModule,
    ActivityModule,
  ],
})
export class AppModule {} 