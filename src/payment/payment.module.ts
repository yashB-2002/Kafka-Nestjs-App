import { Module, OnModuleInit } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [PaymentService],
})
export class PaymentModule implements OnModuleInit {
  constructor(private readonly paymentService: PaymentService) {}

  async onModuleInit() {
    await this.paymentService.listenForPaymentRequests();
  }
}
