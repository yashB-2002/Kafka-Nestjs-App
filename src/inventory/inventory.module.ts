import { Module, OnModuleInit } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [InventoryService],
})
export class InventoryModule implements OnModuleInit {
  constructor(private readonly inventoryService: InventoryService) {}

  async onModuleInit() {
    await this.inventoryService.listenForOrderMessages();
  }
}
