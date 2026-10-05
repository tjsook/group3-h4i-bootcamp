"use client";

import { useEffect, useState } from "react";
import { getDrinks } from "@/lib/drinks";
import { Drink } from "@/types/drink";
import DrinkCard from "@/components/DrinkCard";

export default function MenuPage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  // const grouped = drinks.reduce<Record<string, Drink[]>>((acc, drink) => {
  //   (acc[drink.category] ??= []).push(drink);
  //   return acc;
  // }, {});

  const categories = ["All", ...Array.from(new Set(drinks.map((drink) => drink.category)))];

  const filteredDrinks = drinks.filter((drink) => {
    const matchesSearch = drink.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || drink.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const grouped = filteredDrinks.reduce<Record<string, Drink[]>>((acc, drink) => {
    (acc[drink.category] ??= []).push(drink);
    return acc;
  }, {});

  return (
    <main>
      <h1>Menu</h1>

      <div>
        <input
          type="text"
          placeholder="Search drinks..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />

        <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredDrinks.length === 0 ? (
        <p>No drinks match your search.</p>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h2>{category}</h2>
            <div>
              {items.map((drink) => (
                <DrinkCard key={drink._id} drink={drink} />
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
