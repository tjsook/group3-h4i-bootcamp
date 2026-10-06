"use client";

import { useEffect, useState } from "react";
import { cancelOrder, getOrders } from "@/lib/orders";
import { Order } from "@/types/order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cancellingIds, setCancellingIds] = useState<string[]>([]);
  const [cancelErrors, setCancelErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getOrders();
        if (!cancelled) {
          setOrders([...data].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Failed to load orders");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCancel(order: Order) {
    if (!window.confirm(`Cancel your ${order.size.toLowerCase()} ${order.drinkName} order?`)) return;

    setCancellingIds((ids) => [...ids, order._id]);
    setCancelErrors((errors) => ({ ...errors, [order._id]: "" }));

    try {
      await cancelOrder(order._id);
      setOrders((current) => current.filter((item) => item._id !== order._id));
    } catch (error) {
      setCancelErrors((errors) => ({
        ...errors,
        [order._id]: error instanceof Error ? error.message : "Failed to cancel order",
      }));
    } finally {
      setCancellingIds((ids) => ids.filter((id) => id !== order._id));
    }
  }

  return (
    <main>
      <h1>Orders</h1>
      {loading ? (
        <p role="status">Loading orders...</p>
      ) : loadError ? (
        <p role="alert">Error: {loadError}</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table>
          <caption>All orders, newest first</caption>
          <thead>
            <tr>
              <th scope="col">Drink</th>
              <th scope="col">Size</th>
              <th scope="col">Milk</th>
              <th scope="col">Price</th>
              <th scope="col">Time</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <th scope="row">{order.drinkName}</th>
                <td>{order.size}</td>
                <td>{order.milk || "None"}</td>
                <td>${order.price.toFixed(2)}</td>
                <td>
                  <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString()}</time>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleCancel(order)}
                    disabled={cancellingIds.includes(order._id)}
                    aria-label={`Cancel ${order.size.toLowerCase()} ${order.drinkName} order`}
                  >
                    {cancellingIds.includes(order._id) ? "Cancelling..." : "Cancel"}
                  </button>
                  {cancelErrors[order._id] && <p role="alert">Error: {cancelErrors[order._id]}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
