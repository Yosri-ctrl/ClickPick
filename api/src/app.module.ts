import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PickModule } from './pick/pick.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEROM_HOST,
      database: process.env.TYPEROM_DATABASE,
      username: process.env.TYPEROM_USERNAME,
      password: process.env.TYPEROM_PASSWORSD,
      port: parseInt(process.env.TYPEORM_PORT, 10),
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    PickModule,
    GroupsModule,
  ],
})
export class AppModule {}
