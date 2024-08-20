import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class PaymentService {
  constructor(private readonly kafkaService: KafkaService) {}

  async listenForPaymentRequests() {
    await this.kafkaService.createConsumer('payment-group', ['payment-request-topic'], this.handlePaymentRequest.bind(this));
  }

  async handlePaymentRequest(paymentRequest: any) {
    console.log(`Processing payment for Order ID ${paymentRequest.orderId}.`);

    
    const paymentStatus = 'Paid'; 

    await this.kafkaService.sendMessage('payment-result-topic', {
      orderId: paymentRequest.orderId,
      status: paymentStatus,
    });

    if (paymentStatus === 'Paid') {
      await this.kafkaService.sendMessage('notification-topic', {
        orderId: paymentRequest.orderId,
        userId: paymentRequest.userId,
        status: 'Paid',
      });
    }
  }
}
