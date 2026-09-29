"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Drink } from "@/types/drink";
import { getDrink } from "@/lib/drinks";

export default function Page({ params }: { params: { id: string } }) {
  const [drink, setDrink] = useState<Drink | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    getDrink(params.id)
      .then(setDrink)
      .catch((error) => {
        console.error(error);
        setIsNotFound(true);
      });
  }, [params.id]);

  if (isNotFound) {
    return <p>Drink not found.</p>;
  }

  if (!drink) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{drink.name}</h1>
      <Image src={drink.imageUrl} alt={drink.name} width={300} height={300} />
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
    </div>
  );
}
