import { Admin, Producer } from 'kafkajs'

export default class RedpandaService {
  constructor(private readonly admin: Admin, private readonly producer: Producer) {
    this.producer.connect()
  }

  private async getOrCreateTopic(eventType: string) {
    const existingTopics = await this.admin.listTopics()
    if (existingTopics.includes(eventType)) {
      return existingTopics[existingTopics.indexOf(eventType)]
    }

    await this.admin.createTopics({
      topics: [
        {
          topic: eventType,
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    })

    return eventType
  }

  public async createEvent(eventType: string, webhookUrl: string, payload: object) {
    const topicName = await this.getOrCreateTopic(eventType)
    const eventData = {
      webhookUrl,
      payload,
    }
    await this.producer.send({
      topic: topicName,
      messages: [{ value: JSON.stringify(eventData) }],
    })
  }
}
