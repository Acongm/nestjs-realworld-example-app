import { Module } from '@nestjs/common';
import { ScheduledTaskService } from './scheduled-task.service';
import { ScheduledTaskController } from './scheduled-task.controller';

/**
 * 定时任务模块
 * 管理定时任务相关的服务、控制器等
 * @class ScheduledTaskModule
 */
@Module({
  imports: [],
  providers: [ScheduledTaskService],
  controllers: [ScheduledTaskController],
})
export class ScheduledTaskModule {}
