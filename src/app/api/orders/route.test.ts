import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/orders/route";
import mockDrinks from "@/data/mockDrinks";
import type { Drink } from "@/types/drink";

const { connectDB, findById, createOrder } = vi.hoisted(() => ({
  connectDB: vi.fn(),
  findById: vi.fn(),
  createOrder: vi.fn(),
}));

vi.mock("@/database/db", () => ({ default: connectDB }));
vi.mock("@/database/drinkSchema", () => ({ default: { findById } }));
vi.mock("@/database/orderSchema", () => ({ default: { create: createOrder } }));

const drinkId = "507f1f77bcf86cd799439011";
const coldBrew = { ...mockDrinks[4], _id: drinkId };
const americano = { ...mockDrinks[3], _id: drinkId };

function mockDrink(drink: Drink) {
  findById.mockReturnValue({ lean: vi.fn().mockResolvedValue(drink) });
}

function orderRequest(size: string, milk?: string) {
  return new Request("http://localhost/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ drinkId, size, ...(milk !== undefined ? { milk } : {}) }),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("POST /api/orders", () => {
  it.each([
    { drink: coldBrew, size: "Medium", milk: "Oat", price: 4 },
    { drink: americano, size: "Small", milk: undefined, price: 3.5 },
  ])("creates a valid $drink.name order and returns 201", async ({ drink, size, milk, price }) => {
    mockDrink(drink);
    const orderData = {
      drinkId,
      drinkName: drink.name,
      size,
      ...(milk !== undefined ? { milk } : {}),
      price,
    };
    const savedOrder = { _id: "507f1f77bcf86cd799439012", ...orderData, createdAt: "2026-01-01T00:00:00.000Z" };
    createOrder.mockResolvedValue(savedOrder);

    const response = await POST(orderRequest(size, milk));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(savedOrder);
    expect(connectDB).toHaveBeenCalledOnce();
    expect(findById).toHaveBeenCalledWith(drinkId);
    expect(createOrder).toHaveBeenCalledOnce();
    expect(createOrder).toHaveBeenCalledWith(orderData);
  });

  it.each([
    {
      drink: coldBrew,
      size: "Small",
      milk: "Oat",
      error: 'Size "Small" is not offered for Cold Brew. Choose from: Medium, Large',
    },
    {
      drink: coldBrew,
      size: "Medium",
      milk: "Soy",
      error: "Choose a milk offered for Cold Brew: Whole, Oat, Almond",
    },
    {
      drink: coldBrew,
      size: "Medium",
      milk: undefined,
      error: "Choose a milk offered for Cold Brew: Whole, Oat, Almond",
    },
    {
      drink: americano,
      size: "Small",
      milk: "Oat",
      error: "Americano does not offer milk; omit milk from the order",
    },
  ])("returns 400 with the existing error: $error", async ({ drink, size, milk, error }) => {
    mockDrink(drink);

    const response = await POST(orderRequest(size, milk));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error });
    expect(createOrder).not.toHaveBeenCalled();
  });
});
