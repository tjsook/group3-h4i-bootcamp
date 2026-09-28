"use client";

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

  return <div>{drink.name}</div>;
}
