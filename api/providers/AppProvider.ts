import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import RedpandaService from 'App/services/redpanda.service'
import { Kafka } from 'kafkajs'
import Env from '@ioc:Adonis/Core/Env'
import RedpandaConsumers from 'App/consumers/redpanda.consumers'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    const redpanda = new Kafka({
      brokers: [Env.get('REDPANDA')],
    })
    const consumers = new RedpandaConsumers(redpanda)
    this.app.container.singleton('RedpandaConsumers', () => consumers)
    this.app.container.singleton(
      'RedpandaService',
      () => new RedpandaService(redpanda.admin(), redpanda.producer(), consumers)
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
