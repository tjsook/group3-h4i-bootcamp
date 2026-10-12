"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Drink } from "@/types/drink";
import { getDrink } from "@/lib/drinks";
import { OrderForm } from "@/components/OrderForm";

export default function Page({ params }: { params: { id: string } }) {
  const [drink, setDrink] = useState<Drink | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getDrink(params.id);
        if (cancelled) return;
        if (data) {
          setDrink(data);
        } else {
          setIsNotFound(true);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load drink");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (loading) {
    return (
      <main className="shop-page">
        <p className="page-message" role="status">
          Loading drink...
        </p>
      </main>
    );
  }

  if (isNotFound) {
    return (
      <main className="shop-page">
        <p className="page-message" role="alert">
          Drink not found. It may have been removed from the menu. <Link href="/menu">Back to the menu</Link>
        </p>
      </main>
    );
  }

  if (error || !drink) {
    return (
      <main className="shop-page">
        <p className="page-message" role="alert">
          Something went wrong loading this drink. Please try again later. ({error})
        </p>
      </main>
    );
  }

  return (
    <div>
      <h1>{drink.name}</h1>
      <Image src={drink.imageUrl} alt={drink.name} width={400} height={300} />
      <p>{drink.description}</p>

      <h2>Sizes</h2>
      <ul>
        {drink.sizes.map((option) => (
          <li key={option.size}>
            {option.size}: ${option.price.toFixed(2)}
          </li>
        ))}
      </ul>

      {drink.milkOptions.length > 0 && (
        <>
          <h2>Milk Options</h2>
          <ul>
            {drink.milkOptions.map((milk) => (
              <li key={milk}>{milk}</li>
            ))}
          </ul>
        </>
      )}
      <OrderForm drink={drink} />
    </div>
  );
}
