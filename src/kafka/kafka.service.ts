import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.local.env' });
@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  
  private kafka = new Kafka({
    brokers: ['localhost:9092'],
  });
  private producer: Producer = this.kafka.producer();
  private consumers: Consumer[] = [];

  // private kafka: Kafka;
  // private producer: Producer;
  // private consumers: Consumer[] = [];
 
  // constructor() {
  //   const brokers = process.env.KAFKA_BROKERS.split(',');
  //   const username = process.env.KAFKA_USERNAME || null;
  //   const password = process.env.KAFKA_PASSWORD || null;
 
  //   const kafkaConfig = {
  //     brokers,
  //     logLevel: logLevel.INFO, 
  //   };
 
  //   if (username && password) {
  //     kafkaConfig['sasl'] = {
  //       mechanism: 'plain', 
  //       username,
  //       password,
  //     };
  //   }
 
  //   this.kafka = new Kafka(kafkaConfig);
  //   this.producer = this.kafka.producer();
  // }

  async onModuleInit() {
    console.log("env host"+process.env.LOCAL_ENV_HOST);
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  async sendMessage(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async createConsumer(groupId: string, topics: string[], messageHandler: (message: any) => void) {
    const consumer = this.kafka.consumer({ groupId });
    this.consumers.push(consumer);

    await consumer.connect();
    await consumer.subscribe({ topics });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const parsedMessage = JSON.parse(message.value.toString());
        await messageHandler(parsedMessage);
      },
    });
  }
}
