import { NextResponse } from "next/server";
import mockDrinks from "@/data/mockDrinks";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const drink = mockDrinks.find((drink) => drink._id === params.id);
  if (!drink) {
    return NextResponse.json({ error: "Drink not found" }, { status: 404 });
  } else {
    return NextResponse.json(drink);
  }
}
