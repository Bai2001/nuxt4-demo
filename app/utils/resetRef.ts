import { ref } from 'vue'
import type { Ref } from 'vue'

export const resetRef = <T>(value: T): Ref<T> & { reset: () => void } => {
  const store = value

  const _ref = ref(store) as unknown as Ref<T> & { reset: () => void }
  _ref.reset = () => {
    _ref.value = store
  }
  return _ref
}
