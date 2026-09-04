"use client";

import { Provider } from "react-redux";

import { store } from "@/lib/sandbox/state-management/store";

import ReduxCounter from "@/components/sandbox/state-management/ReduxCounter";
import UseStateCounter from "@/components/sandbox/state-management/UseStateCounter";

export default function StateManagementComparison() {
  return (
    <Provider store={store}>
      <div className="grid gap-6 md:grid-cols-2">
        <UseStateCounter />

        <ReduxCounter />
      </div>
    </Provider>
  );
}
