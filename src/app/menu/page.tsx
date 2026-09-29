"use client";

import { useEffect, useState } from "react";
import { getDrinks } from "@/lib/drinks";
import { Drink } from "@/types/drink";
import DrinkCard from "@/components/DrinkCard";

export default function MenuPage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getDrinks();
        if (!cancelled) setDrinks(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load drinks");
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

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>Error: {error}</div>;

  const grouped = drinks.reduce<Record<string, Drink[]>>((acc, drink) => {
    (acc[drink.category] ??= []).push(drink);
    return acc;
  }, {});

  return (
    <main>
      <h1>Menu</h1>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category}>
          <h2>{category}</h2>
          <div>
            {items.map((drink) => (
              <DrinkCard key={drink._id} drink={drink} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
