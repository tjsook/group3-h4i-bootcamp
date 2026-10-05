import { NextResponse } from "next/server";
import { isObjectIdOrHexString } from "mongoose";
import connectDB from "@/database/db";
import DrinkModel from "@/database/drinkSchema";
import OrderModel from "@/database/orderSchema";
import { Drink } from "@/types/drink";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to fetch orders", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Request body must be an order object" }, { status: 400 });
  }

  const { drinkId, size, milk } = body as Record<string, unknown>;
  if (typeof drinkId !== "string" || !isObjectIdOrHexString(drinkId)) {
    return NextResponse.json({ error: "drinkId must be a valid drink ID" }, { status: 400 });
  }
  if (typeof size !== "string" || !size) {
    return NextResponse.json({ error: "size is required and must be a string" }, { status: 400 });
  }
  if (milk !== undefined && typeof milk !== "string") {
    return NextResponse.json({ error: "milk must be a string when provided" }, { status: 400 });
  }

  try {
    await connectDB();
    const drink = await DrinkModel.findById(drinkId).lean<Drink>();
    if (!drink) {
      return NextResponse.json({ error: "Drink not found" }, { status: 404 });
    }

    const sizeOption = drink.sizes.find((option) => option.size === size);
    if (!sizeOption) {
      return NextResponse.json(
        {
          error: `Size "${size}" is not offered for ${drink.name}. Choose from: ${drink.sizes.map((option) => option.size).join(", ")}`,
        },
        { status: 400 },
      );
    }

    if (drink.milkOptions.length > 0 && (typeof milk !== "string" || !drink.milkOptions.includes(milk))) {
      return NextResponse.json(
        { error: `Choose a milk offered for ${drink.name}: ${drink.milkOptions.join(", ")}` },
        { status: 400 },
      );
    }
    if (drink.milkOptions.length === 0 && milk !== undefined) {
      return NextResponse.json(
        { error: `${drink.name} does not offer milk; omit milk from the order` },
        { status: 400 },
      );
    }

    const order = await OrderModel.create({
      drinkId: drink._id,
      drinkName: drink.name,
      size: sizeOption.size,
      ...(milk !== undefined ? { milk } : {}),
      price: sizeOption.price,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Failed to place order", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
