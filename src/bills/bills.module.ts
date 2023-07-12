import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { Bill } from './entities/bill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill])],
  providers: [BillsService],
  controllers: [BillsController],
  exports: [BillsService],
})
export class BillsModule {}
