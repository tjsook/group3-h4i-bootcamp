"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getDrinks } from "@/lib/drinks";
import { Drink } from "@/types/drink";
import DrinkCard from "@/components/DrinkCard";
import Link from "next/link";

export default function Home() {
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
        console.error(err);
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

  const bestSeller = drinks.find((drink) => drink.isBestseller);

  return (
    <main className="home">
      <h1>
        <Image src="/logo.png" alt="Coffee" width={50} height={50} />
        Coffee Shop
      </h1>
      <h2>Welcome to our coffee shop!</h2>

      <section>
        <h2> Our Best Seller!</h2>
        {loading ? (
          <p className="page-message" role="status">
            Loading drinks...
          </p>
        ) : error ? (
          <p className="page-message" role="alert">
            Error: {error}
          </p>
        ) : bestSeller ? (
          <DrinkCard drink={bestSeller} />
        ) : (
          <p className="page-message" role="status">
            No bestseller right now. Check out the full menu below!
          </p>
        )}
      </section>

      <section>
        <h2>Order Now!</h2>
        <p>Check out our menu and order your favorite drinks!</p>
        <Link href="/menu">Menu</Link>
      </section>
    </main>
  );
}
