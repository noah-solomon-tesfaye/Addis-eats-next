import { randomUUID } from "node:crypto";
import { readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";

const DATA_FILE = path.join(process.cwd(), "data", "dishes.json");

const LEGACY_FILE = path.join(
  process.cwd(),
  "src",
  "lib",
  "dishes.js"
);

const initialDishes = [
  {
    id: "doro-wat",
    name: "Doro Wat",
    description: "Spicy Ethiopian chicken stew with berbere, slow-cooked onions, and hard-boiled egg served with injera.",
    price: 1450,
    category: "ethiopian",
    isFasting: false,
    spiceLevel: "Hot",
    image: "/images/doro.jpg",
    ingredients: ["Chicken", "Berbere", "Onions", "Niter Kibbeh", "Hard-boiled Egg", "Injera"],
    discountPer: 10,
  },
];

async function readDishes() {
  try {
    const content = await readFile(DATA_FILE, "utf8");
    const dishes = JSON.parse(content);

    if (!Array.isArray(dishes)) {
      throw new Error("Dish data must be an array.");
    }

    return dishes;
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    await writeFile(
      DATA_FILE,
      JSON.stringify(initialDishes, null, 2) + "\n",
      "utf8"
    );

    return initialDishes;
  }
}

async function saveDishes(dishes) {
  const temporaryFile = `${DATA_FILE}.${randomUUID()}.tmp`;

  try {
    await writeFile(
      temporaryFile,
      JSON.stringify(dishes, null, 2) + "\n",
      "utf8"
    );

    await rename(temporaryFile, DATA_FILE);
  } catch (error) {
    try {
      const { unlink } = await import("node:fs/promises");
      await unlink(temporaryFile);
    } catch {
      // Ignore temporary-file cleanup errors.
    }

    throw error;
  }
}

export async function getDishes() {
  return readDishes();
}

export async function getDishById(id) {
  const dishes = await readDishes();
  return dishes.find((dish) => dish.id === id) ?? null;
}

export async function createDish(input) {
  const dishes = await readDishes();

  const dish = {
    ...input,
    id: input.id || randomUUID(),
  };

  if (dishes.some((item) => item.id === dish.id)) {
    throw new Error("A dish with that ID already exists.");
  }

  dishes.push(dish);
  await saveDishes(dishes);

  return dish;
}

export async function updateDish(id, input) {
  const dishes = await readDishes();
  const index = dishes.findIndex((dish) => dish.id === id);

  if (index === -1) {
    return null;
  }

  const updated = {
    ...dishes[index],
    ...input,
    id: dishes[index].id,
  };

  dishes[index] = updated;
  await saveDishes(dishes);

  return updated;
}

export async function deleteDish(id) {
  const dishes = await readDishes();
  const updated = dishes.filter((dish) => dish.id !== id);

  if (updated.length === dishes.length) {
    return false;
  }

  await saveDishes(updated);
  return true;
}
