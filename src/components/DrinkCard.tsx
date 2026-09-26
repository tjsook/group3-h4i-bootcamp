import Image from "next/image";
import Link from "next/link";
import { Drink } from "@/types/drink";

interface DrinkCardProps {
  drink: Drink;
}

export default function DrinkCard({ drink }: DrinkCardProps) {
  const lowestPrice = Math.min(...drink.sizes.map((s) => s.price));

  return (
    <Link href={`/menu/${drink._id}`}>
      <div>
        <Image src={drink.imageUrl} alt={drink.name} width={200} height={200} />
        <h3>{drink.name}</h3>
        <p>{drink.category}</p>
        <p>From ${lowestPrice.toFixed(2)}</p>
      </div>
    </Link>
  );
}
