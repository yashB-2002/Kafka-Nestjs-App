import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { CreateOrderDto } from './createOrderDto';

@Injectable()
export class OrderService {
  constructor(private readonly kafkaService: KafkaService) {}

  async createOrder(order: CreateOrderDto) {
    const orderData = { ...order, status: 'Pending', id: Date.now() };

    await this.kafkaService.sendMessage('order-topic', orderData);

    return orderData;
  }

  async updateOrderStatus(orderId: number, status: string) {
    console.log(`Order ID ${orderId} status updated to ${status}`);
  }
}
