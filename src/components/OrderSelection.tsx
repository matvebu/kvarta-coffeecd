"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type OrderType = "one_time" | "subscription";

type OrderSelectionValue = {
  orderType: OrderType | "";
  product: string;
  status: string;
  selectProduct: (product: string) => void;
  selectSubscription: () => void;
  setOrderType: (orderType: OrderType) => void;
  setProduct: (product: string) => void;
};

const OrderSelectionContext = createContext<OrderSelectionValue | null>(null);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToLeadForm() {
  const form = document.getElementById("order-form");
  if (!form) return;
  form.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

function focusControl(id: string) {
  window.requestAnimationFrame(() => {
    document.getElementById(id)?.focus({ preventScroll: true });
  });
}

export function OrderSelectionProvider({ children }: { children: ReactNode }) {
  const [orderType, setOrderTypeState] = useState<OrderType | "">("");
  const [product, setProductState] = useState("");
  const [status, setStatus] = useState("");

  const selectProduct = (nextProduct: string) => {
    setOrderTypeState("one_time");
    setProductState(nextProduct);
    setStatus(`Выбран разовый заказ: ${nextProduct}`);
    scrollToLeadForm();
    focusControl("order-product");
  };

  const selectSubscription = () => {
    setOrderTypeState("subscription");
    setProductState("");
    setStatus("Выбрана подписка");
    scrollToLeadForm();
    focusControl("order-type-subscription");
  };

  const setOrderType = (next: OrderType) => {
    setOrderTypeState(next);
    if (next === "subscription") {
      setProductState("");
      setStatus("Выбрана подписка");
      return;
    }
    setStatus(product ? `Выбран разовый заказ: ${product}` : "Выбран разовый заказ");
  };

  const setProduct = (nextProduct: string) => {
    setProductState(nextProduct);
    if (nextProduct) {
      setOrderTypeState("one_time");
      setStatus(`Выбран разовый заказ: ${nextProduct}`);
    }
  };

  return (
    <OrderSelectionContext.Provider
      value={{
        orderType,
        product,
        status,
        selectProduct,
        selectSubscription,
        setOrderType,
        setProduct,
      }}
    >
      {children}
    </OrderSelectionContext.Provider>
  );
}

export function useOrderSelection() {
  const value = useContext(OrderSelectionContext);
  if (!value) {
    throw new Error("useOrderSelection must be used within OrderSelectionProvider");
  }
  return value;
}

export function ProductCta({
  product,
  children,
  className = "",
}: {
  product: string;
  children: ReactNode;
  className?: string;
}) {
  const { selectProduct } = useOrderSelection();

  return (
    <button
      type="button"
      className={`inline-flex min-h-11 shrink-0 items-center justify-center bg-accent px-3.5 font-body text-label-caps uppercase text-white shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${className}`}
      onClick={() => selectProduct(product)}
    >
      {children}
    </button>
  );
}

export function SubscriptionCta({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { selectSubscription } = useOrderSelection();

  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${className}`}
      onClick={selectSubscription}
    >
      {children}
    </button>
  );
}
