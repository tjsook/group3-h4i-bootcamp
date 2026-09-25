"use client";

import { useEffect, useState } from "react";
import { Drink } from "@/types/drink";
import { getDrink } from "@/lib/drinks";

export default function Page({ params }: { params: { id: string } }) {
  const [drink, setDrink] = useState<Drink | null>(null);

  useEffect(() => {
    getDrink(params.id).then(setDrink).catch(console.error);
  }, [params.id]);
  return <div>{drink?.name}</div>;
}
