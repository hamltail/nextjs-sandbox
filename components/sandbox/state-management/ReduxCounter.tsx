"use client";

import {
  decrement,
  increment,
  reset,
} from "@/lib/sandbox/state-management/counterSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/sandbox/state-management/hooks";

export default function ReduxCounter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="border-border bg-surface/90 rounded-2xl border p-6 shadow-sm">
      <p className="font-en text-primary text-sm font-semibold tracking-[0.18em]">
        Redux Toolkit
      </p>

      <p className="mt-6 text-center text-5xl font-bold">{count}</p>

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(decrement())}
          className="border-border hover:border-primary min-w-12 rounded-full border px-4 py-2 font-semibold transition"
        >
          −
        </button>

        <button
          type="button"
          onClick={() => dispatch(reset())}
          className="border-border hover:border-primary rounded-full border px-4 py-2 text-sm font-semibold transition"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={() => dispatch(increment())}
          className="border-border hover:border-primary min-w-12 rounded-full border px-4 py-2 font-semibold transition"
        >
          ＋
        </button>
      </div>
    </div>
  );
}
