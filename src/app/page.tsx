"use client";

import Image from "next/image";
import mockDrinks from "@/data/mockDrinks";
//import getDrinks from "@/data/mockDrinks"; (Will switch to getDrinks when 4 merges.)

export default function Home() {
  const found = mockDrinks.find((drink) => drink.isBestseller);
  //const drinks = getDrinks(); (Will switch...prolly already merged but..)

  return (
    <main>
      <h1>
        {" "}
        <Image src="/logo.png" alt="Coffee" width={600} height={400} /> Coffee Shop
      </h1>
      <h2>Welcome to our coffee shop!</h2>

      <section>
        <div> Our Best Seller!</div>
        {found && (
          <div>
            <Image src={found.imageUrl} alt={found.name} width={200} height={200} />
            <h3>{found.name}</h3>
            <p>{found.description}</p>
          </div>
        )}
      </section>
      <section>
        <h2>Order Now!</h2>
        <p>Check out our menu and order your favorite drinks!</p>
        <a href="/menu">Go to Menu</a>
      </section>
    </main>
  );
}
