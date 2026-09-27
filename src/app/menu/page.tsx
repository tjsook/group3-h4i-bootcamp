"use client";

import mockDrinks from "@/data/mockDrinks";
import { useEffect, useState } from "react";
import { getDrink, getDrinks } from "@/lib/drinks";
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

  if (loading) return <div className="p-6">Loading menu...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  const grouped = drinks.reduce<Record<string, Drink[]>>((acc, drink) => {
    const category = drink.category ?? "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(drink);
    return acc;
  }, {});

  return (
    <main className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Menu</h1>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category}>
          <h2 className="text-xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((drink) => (
              <DrinkCard key={drink._id} drink={drink} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
