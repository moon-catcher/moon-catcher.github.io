import { createCounter } from "@/stores/Counter";
import { runInAction } from "mobx";
import { useEffect } from "react";
import { useParams } from "react-router";
import { observer, useLocalObservable } from "mobx-react";
import { Counter } from "@/providers/CounterProvider";

// const counterStore = createCounter(0)
/**
 * @description 组件内mobx使用示例
 * @returns
 */
const CounterPage = () => {
  const { counterNumber } = useParams();
  const counterStore: Counter = useLocalObservable(() => createCounter(0));

  useEffect(() => {
    runInAction(() => (counterStore.value = Number(counterNumber) || 0));
  }, [counterNumber]);
  return (
    <>
      <div>CounterPage</div>
      <div style={{ fontSize: 100, textAlign: "center", color: "wheat" }}>
        <button onClick={() => counterStore.decreases()}>-</button>
        <span>{counterStore.value}</span>
        <button onClick={() => counterStore.increment()}>+</button>
      </div>
    </>
  );
};

export default observer(CounterPage);
