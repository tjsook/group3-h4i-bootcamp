import mockDrinks from "@/data/mockDrinks";
import DrinkCard from "@/components/DrinkCard";

export default function MenuPage() {
  return (
    <div>
      <DrinkCard drink={mockDrinks[0]} />
    </div>
  );
}
