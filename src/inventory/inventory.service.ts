import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class InventoryService {
  private inventory = new Map<number, number>([
    [1, 100], 
    [2, 50],  
    [3, 30],  
  ]);

  constructor(private readonly kafkaService: KafkaService) {}

  async listenForOrderMessages() {
    await this.kafkaService.createConsumer('inventory-group', ['order-topic'], this.handleOrderMessage.bind(this));
  }

  async handleOrderMessage(order: any) {
    const currentStock = this.inventory.get(order.productId) || 0;

    if (currentStock >= order.quantity) {
      this.inventory.set(order.productId, currentStock - order.quantity);
      console.log(`Inventory updated: ${order.quantity} units of Product ID ${order.productId} reserved.`);

      await this.kafkaService.sendMessage('payment-request-topic', {
        orderId: order.id,
        userId: order.userId,
        productId: order.productId,
        quantity: order.quantity,
        amount: order.amount, 
      });

    } else {
      console.log(`Not enough stock for Product ID ${order.productId}.`);

      await this.kafkaService.sendMessage('notification-topic', {
        orderId: order.id,
        userId: order.userId,
        productId: order.productId,
        status: 'Out of Stock',
      });
    }
  }
}
