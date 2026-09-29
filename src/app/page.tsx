"use client";

import Image from "next/image";
import mockDrinks from "@/data/mockDrinks";
import { useEffect, useState } from "react";
import { getDrink, getDrinks } from "@/lib/drinks";
import { Drink } from "@/types/drink";
import DrinkCard from "@/components/DrinkCard";

export default function Home() {
  const [drinks, setDrinks] = useState<Drink[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getDrinks();
      setDrinks(data);
    }
    load();
  }, []);

  const bestSeller = drinks.find((drink) => drink.isBestseller);

  return (
    <main>
      <h1>
        <Image src="/logo.png" alt="Coffee" width={600} height={400} />
        Coffee Shop
      </h1>
      <h2>Welcome to our coffee shop!</h2>

      <section>
        <h2> Our Best Seller!</h2>
        {bestSeller && <DrinkCard drink={bestSeller} />}
      </section>

      <section>
        <h2>Order Now!</h2>
        <p>Check out our menu and order your favorite drinks!</p>
        <a href="/menu">Go to Menu</a>
      </section>
    </main>
  );
}
