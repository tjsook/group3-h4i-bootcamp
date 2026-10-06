"use client";

import { useState } from "react";
import { Drink } from "@/types/drink";
import { placeOrder } from "@/lib/orders";

export function OrderForm({ drink }: { drink: Drink }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMilk, setSelectedMilk] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasMilkOptions = drink.milkOptions.length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!selectedSize) {
      setMessage("Please choose a size!");
      return;
    }

    if (hasMilkOptions && !drink.milkOptions.includes(selectedMilk)) {
      setMessage("Please choose a valid milk option!");
      return;
    }

    try {
      setIsSubmitting(true);

      console.log("drink._id:", drink._id, typeof drink._id);
      await placeOrder({
        drinkId: drink._id,
        size: selectedSize,
        ...(hasMilkOptions ? { milk: selectedMilk } : {}),
      });

      setMessage("Order placed successfully!");
      setSelectedSize("");
      setSelectedMilk("");
    } catch (error) {
      console.error("Failed to place order:", error);
      setMessage("Your order could not be placed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Customize your order</h2>

      <fieldset>
        <legend>Size</legend>

        {drink.sizes.map((option) => (
          <label key={option.size}>
            <input
              type="radio"
              name="size"
              value={option.size}
              checked={selectedSize === option.size}
              onChange={(event) => setSelectedSize(event.target.value)}
            />
            {option.size} (${option.price.toFixed(2)})
          </label>
        ))}
      </fieldset>

      {hasMilkOptions && (
        <label>
          Milk choice
          <select value={selectedMilk} onChange={(event) => setSelectedMilk(event.target.value)}>
            <option value="">Choose milk</option>

            {drink.milkOptions.map((milk) => (
              <option key={milk} value={milk}>
                {milk}
              </option>
            ))}
          </select>
        </label>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Placing order..." : "Place order"}
      </button>

      {message && <p role="alert">{message}</p>}
    </form>
  );
}
