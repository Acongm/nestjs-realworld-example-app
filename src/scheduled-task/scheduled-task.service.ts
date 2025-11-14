import { Injectable } from '@nestjs/common';
import { CreateScheduledTaskDto } from './dto';
import { ScheduledTask } from './scheduled-task.interface';
import { WeekEnum } from './enums/week.enum';

/**
 * 定时任务服务类
 * 负责定时任务的业务逻辑处理，包括创建、更新、查询等操作
 * @class ScheduledTaskService
 */
@Injectable()
export class ScheduledTaskService {
  /**
   * 内存存储，使用 Map 结构存储所有定时任务
   * key: 任务ID, value: 任务对象
   * @private
   * @type {Map<string, ScheduledTask>}
   */
  private tasksStorage: Map<string, ScheduledTask> = new Map();

  /**
   * 获取所有定时任务列表
   * 按创建时间倒序排列
   * @returns {Promise<ScheduledTask[]>} 返回所有定时任务数组
   */
  async findAll(): Promise<ScheduledTask[]> {
    const tasks = Array.from(this.tasksStorage.values());
    // 按创建时间倒序排列
    return tasks.sort((a, b) => b.created.getTime() - a.created.getTime());
  }

  /**
   * 根据 frequency 和 time 生成 Cron 表达式
   * @param {string} frequency - 执行频率（daily, weekly, monthly）
   * @param {object} time - 时间配置对象
   * @returns {string} 返回生成的 Cron 表达式
   */
  private generateCronExpression(frequency: string, time: { time: string; week?: WeekEnum; day?: number }): string {
    // 解析时间字符串（格式：HH:mm）
    const [hour, minute] = time.time.split(':').map(Number);

    // Cron 表达式格式：秒 分 时 日 月 星期
    // 秒固定为 0
    const second = '0';
    const min = minute.toString();
    const hr = hour.toString();

    switch (frequency.toLowerCase()) {
      case 'daily':
        // 每天执行：0 分 时 * * *
        return `${second} ${min} ${hr} * * *`;

      case 'weekly':
        // 每周执行：需要 week 字段
        if (!time.week) {
          throw new Error('weekly 频率需要提供 week 字段');
        }
        // 星期映射：Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6, Sun=0
        const weekMap: { [key in WeekEnum]: string } = {
          [WeekEnum.MON]: '1',
          [WeekEnum.TUE]: '2',
          [WeekEnum.WED]: '3',
          [WeekEnum.THU]: '4',
          [WeekEnum.FRI]: '5',
          [WeekEnum.SAT]: '6',
          [WeekEnum.SUN]: '0',
        };
        const weekDay = weekMap[time.week];
        // 0 分 时 * * 星期
        return `${second} ${min} ${hr} * * ${weekDay}`;

      case 'monthly':
        // 每月执行：需要 day 字段
        if (!time.day) {
          throw new Error('monthly 频率需要提供 day 字段');
        }
        // 0 分 时 日 * *
        return `${second} ${min} ${hr} ${time.day} * *`;

      default:
        throw new Error(`不支持的频率类型: ${frequency}，支持的类型: daily, weekly, monthly`);
    }
  }

  /**
   * 创建或更新定时任务
   * 如果任务ID已存在则更新，不存在则创建新任务
   * cronExpression 会根据 frequency 和 time 自动生成
   * @param {CreateScheduledTaskDto} taskData - 定时任务数据
   * @returns {Promise<ScheduledTask>} 返回创建或更新后的任务对象
   */
  async createOrUpdate(taskData: CreateScheduledTaskDto): Promise<ScheduledTask> {
    // 根据 frequency 和 time 自动生成 cronExpression
    const cronExpression = this.generateCronExpression(taskData.frequency, taskData.time);

    const existingTask = this.tasksStorage.get(taskData.id);

    if (existingTask) {
      // 更新现有任务
      const updatedTask: ScheduledTask = {
        ...existingTask,
        ...taskData,
        cronExpression, // 使用自动生成的 cronExpression
        updated: new Date(),
      };
      this.tasksStorage.set(taskData.id, updatedTask);
      return updatedTask;
    } else {
      // 创建新任务
      const newTask: ScheduledTask = {
        ...taskData,
        cronExpression, // 使用自动生成的 cronExpression
        created: new Date(),
        updated: new Date(),
      };
      this.tasksStorage.set(taskData.id, newTask);
      return newTask;
    }
  }
}
