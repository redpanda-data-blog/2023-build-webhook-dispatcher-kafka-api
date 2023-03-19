export default interface RedpandaInterface {
  createEvent(eventType: string, webhookUrl: string, payload: object): Promise<void>
}
