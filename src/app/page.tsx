"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getDrinks } from "@/lib/drinks";
import { Drink } from "@/types/drink";
import DrinkCard from "@/components/DrinkCard";
import Link from "next/link";

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
    <main className="home">
      <h1>
        <Image src="/logo.png" alt="Coffee" width={50} height={50} />
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
        <Link href="/menu">Menu</Link>
      </section>
    </main>
  );
}
