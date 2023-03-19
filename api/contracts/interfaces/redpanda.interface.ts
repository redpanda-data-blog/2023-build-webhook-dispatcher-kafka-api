export default interface RedpandaInterface {
  getOrCreateTopic(eventType: string): Promise<string>
  createEvent(eventType: string, webhookUrl: string, payload: object): Promise<void>
}
