import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class NotificationService {
  constructor(private readonly kafkaService: KafkaService) {}

  async listenForNotifications() {
    await this.kafkaService.createConsumer('notification-group', ['notification-topic'], this.handleNotification.bind(this));
  }

  async handleNotification(notification: any) {
    console.log(`Notification: Order ID ${notification.orderId} for User ${notification.userId} - Status: ${notification.status}`);
    
  }
}
