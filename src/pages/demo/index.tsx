import { createSignal } from 'solid-js'
import './index.less'

/**  */
export default function DemoIndex() {
  const [count, setCount] = createSignal(0)
  return (
    <div class="f-c/s flex-col">
      <p class="demo">这里是一些简单的示例，仅供参考</p>
      <button class="b-none bg-sky-2 px-20px py-10px" onClick={() => setCount(c => c + 1)}>
        count = {count()}
      </button>
    </div>
  )
};
