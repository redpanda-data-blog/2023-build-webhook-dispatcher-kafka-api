import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import RedpandaService from 'App/services/redpanda.service'
import { Kafka } from 'kafkajs'
import Env from '@ioc:Adonis/Core/Env'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    const redpanda = new Kafka({
      brokers: [Env.get('REDPANDA')],
    })
    this.app.container.singleton(
      'RedpandaService',
      () => new RedpandaService(redpanda.admin())
    )
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
