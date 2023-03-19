import { Admin } from 'kafkajs'

export default class RedpandaService {
  constructor(private readonly admin: Admin) {}

  public async getOrCreateTopic(eventType: string) {
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
}
