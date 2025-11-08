import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/user.entity';

@Module({
  imports: [
    // Load environment variables globally (.env)
    ConfigModule.forRoot({ isGlobal: true }),

    // Connect to Render PostgreSQL via TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // from .env or Render
      entities: [User], // all your entities here
      synchronize: true, // auto-create tables (disable in production)
      ssl: {
        rejectUnauthorized: false, // required for Render's managed Postgres
      },
    }),

    // Feature modules
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
