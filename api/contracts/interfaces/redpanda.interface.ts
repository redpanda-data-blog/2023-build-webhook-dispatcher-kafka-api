export default interface RedpandaInterface {
  getOrCreateTopic(eventType: string): Promise<string>
}
