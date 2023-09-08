import { runInAction } from "mobx";
import { useEffect } from "react";
import { useParams } from "react-router";
import { observer } from "mobx-react";
import { useCounter } from "@/providers/CounterProvider";

// const counterStore = createCounter(0)
/**
 * @description 组件内mobx使用示例
 * @returns
 */
const CounterXPage = () => {
  const { counterNumber } = useParams();
  const counterStore = useCounter();
  useEffect(() => {
    runInAction(() => (counterStore.value = Number(counterNumber) || 0));
  }, [counterNumber]);
  return (
    <>
      <div>CounterXPage</div>
      <div style={{ fontSize: 100, textAlign: "center", color: "wheat" }}>
        <button onClick={() => counterStore.decreases()}>-</button>
        <span>{counterStore.value}</span>
        <button onClick={() => counterStore.increment()}>+</button>
      </div>
    </>
  );
};

export default observer(CounterXPage);
