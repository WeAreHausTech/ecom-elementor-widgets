type EventKey = string | symbol | number
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHandler<T = any> = (payload: T) => void
type EventMap = Record<EventKey, EventHandler>

interface EventBus<T extends EventMap> {
  on<Key extends keyof T>(key: Key, handler: T[Key]): () => void
  off<Key extends keyof T>(key: Key, handler: T[Key]): void
  once<Key extends keyof T>(key: Key, handler: T[Key]): void
  emit<Key extends keyof T>(key: Key, ...payload: Parameters<T[Key]>): void
}

interface EventBusConfig {
  onError: (...params: unknown[]) => void
}

export function eventbus<E extends EventMap>(config?: EventBusConfig) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handlersMap: Map<EventKey, Map<Function, EventListenerOrEventListenerObject>> = new Map()

  const onError = config?.onError ?? ((...params: unknown[]) => console.error(...params))

  const on: EventBus<E>['on'] = (key, handler) => {
    const eventHandler = (event: Event) => {
      try {
        handler((event as CustomEvent).detail)
      } catch (e) {
        onError(e)
      }
    }

    if (!handlersMap.has(key)) {
      handlersMap.set(key, new Map())
    }
    handlersMap.get(key)!.set(handler, eventHandler)

    document.addEventListener(key.toString(), eventHandler)

    return () => {
      off(key, handler)
    }
  }

  const off: EventBus<E>['off'] = (key, handler) => {
    const handlers = handlersMap.get(key)
    if (handlers) {
      const registeredHandler = handlers.get(handler)
      if (registeredHandler) {
        document.removeEventListener(key.toString() as keyof DocumentEventMap, registeredHandler)
        handlers.delete(handler)
      }
    }
  }

  const once: EventBus<E>['once'] = (key, handler) => {
    const eventHandler = ((event: Event) => {
      try {
        handler((event as CustomEvent).detail)
        off(key, handler)
      } catch (e) {
        onError(e)
      }
    }) as unknown as E[typeof key]

    on(key, eventHandler)
  }

  const emit: EventBus<E>['emit'] = (key, ...payload) => {
    document.dispatchEvent(
      new CustomEvent(key.toString(), { detail: payload.length === 1 ? payload[0] : payload }),
    )
  }

  return { on, off, once, emit }
}
