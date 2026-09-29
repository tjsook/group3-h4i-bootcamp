import { NextResponse } from "next/server";
import mockDrinks from "@/data/mockDrinks";

export async function GET() {
  return NextResponse.json(mockDrinks);
}
