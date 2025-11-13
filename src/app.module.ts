import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { UsersModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { EngineModule } from './modules/products/deutz/engine.module';
import { CompanyModule } from './modules/companies/company.module';
import { CompanyFormsModule } from './modules/company-forms/company-forms.module';
import { FormsModule } from './modules/forms/forms.module';

import { User } from './modules/users/user.entity';
import { Customer } from './modules/customer/customer.entity';
import { Engine } from './modules/products/deutz/engine.entity';
import { Company } from './modules/companies/company.entity';
import { CompanyForm } from './modules/company-forms/company-forms.entity';
import { Form } from './modules/forms/forms.entity';

import { ApiKeyGuard } from './guards/api.key.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Customer, Engine, Company, CompanyForm, Form],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    } as any),

    UsersModule,
    AuthModule,
    CustomerModule,
    EngineModule,
    CompanyModule,
    CompanyFormsModule,
    FormsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard, 
    },
  ],
})
export class AppModule {}
