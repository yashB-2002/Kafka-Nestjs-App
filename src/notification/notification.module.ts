import { Module, OnModuleInit } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [NotificationService],
})
export class NotificationModule implements OnModuleInit {
  constructor(private readonly notificationService: NotificationService) {}

  async onModuleInit() {
    await this.notificationService.listenForNotifications();
  }
}
