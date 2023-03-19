import { Consumer, Kafka } from 'kafkajs'
import axios from 'axios'

export default class RedpandaConsumers {
  private readonly aliveConsumers: Consumer[]

  constructor(private readonly redpanda: Kafka) {
    this.aliveConsumers = []
    this.initializeConsumersForExistingTopics()
  }

  public async connectNewConsumer(topicName: string) {
    const consumer = await this.initializeSingleConsumer(topicName)
    this.aliveConsumers.push(consumer)
  }

  private async initializeConsumersForExistingTopics() {
    const topics = await this.redpanda.admin().listTopics()

    topics
      .filter((topic) => !topic.startsWith('_'))
      .map(async (topic) => {
        const consumer = await this.initializeSingleConsumer(topic)
        this.aliveConsumers.push(consumer)
      })
  }

  private async initializeSingleConsumer(topic: string) {
    const consumer = this.redpanda.consumer({ groupId: `webhook-sending-group-${topic}` })
    await consumer.connect()
    await consumer.subscribe({ topic })
    await consumer.run({
      eachMessage: async ({ message }) => {
        const event = JSON.parse((message.value as Buffer).toString())

        const { webhookUrl, payload } = event

        await axios.post(webhookUrl, { ...payload })
      },
    })
    return consumer
  }
}
