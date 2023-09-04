type EventKey = string | symbol
type EventHandler<T = any> = (payload: T) => void
type EventMap = Record<EventKey, EventHandler>

interface EventBus<T extends EventMap> {
  on<Key extends keyof T>(key: Key, handler: T[Key]): () => void
  off<Key extends keyof T>(key: Key, handler: T[Key]): void
  once<Key extends keyof T>(key: Key, handler: T[Key]): void
  emit<Key extends keyof T>(key: Key, ...payload: Parameters<T[Key]>): void
}

interface EventBusConfig {
  onError: (...params: any[]) => void
}

export function eventbus<E extends EventMap>(config?: EventBusConfig) {
  const on: EventBus<E>['on'] = (key, handler) => {
    const eventHandler = (event: Event) => {
      try {
        handler((event as CustomEvent).detail)
      } catch (e) {
        config?.onError(e)
      }
    }
    document.addEventListener(key.toString(), eventHandler)

    return () => {
      document.removeEventListener(key.toString(), eventHandler)
    }
  }

  const off: EventBus<E>['off'] = (key, handler) => {
    document.removeEventListener(key.toString(), handler as EventListener)
  }

  const once: EventBus<E>['once'] = (key, handler) => {
    const eventHandler = (event: Event) => {
      try {
        handler((event as CustomEvent).detail)
        document.removeEventListener(key.toString(), eventHandler)
      } catch (e) {
        config?.onError(e)
      }
    }
    document.addEventListener(key.toString(), eventHandler)
  }

  const emit: EventBus<E>['emit'] = (key, ...payload) => {
    document.dispatchEvent(new CustomEvent(key.toString(), { detail: payload }))
  }

  return { on, off, once, emit }
}
