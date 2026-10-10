const dishes = [
  {
    id: "doro-wat",
    name: "Doro Wat",
    description:
      "Spicy Ethiopian chicken stew with berbere, slow-cooked onions, and hard-boiled egg served with injera.",
    price: 1450,
    category: "ethiopian",
    isFasting: false,
    spiceLevel: "Hot 🔥",
    image: "/images/doro.jpg",
    ingredients: [
      "Chicken",
      "Berbere",
      "Onions",
      "Niter Kibbeh",
      "Hard-boiled Egg",
      "Injera",
    ],
    discountPer: 10,
  },

  {
    id: "tibs",
    name: "Tibs",
    description:
      "Sautéed beef cubes with peppers, onions, and rosemary, served sizzling hot on a clay plate.",
    price: 1520,
    category: "ethiopian",
    isFasting: false,
    spiceLevel: "Medium 🌶️",
    image: "/images/tibs.jpg",
    ingredients: [
      "Beef",
      "Bell Peppers",
      "Onions",
      "Rosemary",
      "Garlic",
      "Injera",
    ],
    discountPer: 0,
  },

  {
    id: "kitfo",
    name: "Kitfo",
    description:
      "Ethiopian steak tartare seasoned with mitmita and kibbeh, served with gomen and ayib cheese.",
    price: 1600,
    category: "ethiopian",
    isFasting: false,
    spiceLevel: "Hot 🔥",
    image: "/images/kitfo.jpg",
    ingredients: [
      "Raw Minced Beef",
      "Mitmita",
      "Niter Kibbeh",
      "Gomen",
      "Ayib",
      "Injera",
    ],
    discountPer: 0,
  },

  {
    id: "shiro-wat",
    name: "Shiro Wat",
    description:
      "Thick and hearty chickpea flour stew simmered with garlic, ginger, and berbere spices.",
    price: 250,
    category: "fasting",
    isFasting: true,
    spiceLevel: "Medium 🌶️",
    image: "/images/shiro.jpg",
    ingredients: [
      "Chickpea Flour",
      "Garlic",
      "Ginger",
      "Onions",
      "Berbere",
      "Oil",
    ],
    discountPer: 0,
  },

  {
    id: "misir-wot",
    name: "Misir Wot",
    description:
      "Red lentil stew slowly cooked with berbere, onions, and garlic. A classic fasting dish.",
    price: 300,
    category: "fasting",
    isFasting: true,
    spiceLevel: "Hot 🔥",
    image: "/images/miser.jpeg",
    ingredients: [
      "Red Lentils",
      "Berbere",
      "Onions",
      "Garlic",
      "Tomato Paste",
      "Oil",
    ],
    discountPer: 5,
  },

  {
    id: "gomen",
    name: "Gomen",
    description:
      "Chopped collard greens sautéed with garlic and ginger. Light, healthy, and flavorful.",
    price: 350,
    category: "fasting",
    isFasting: true,
    spiceLevel: "Mild 😊",
    image: "/images/Gomen.jpg",
    ingredients: [
      "Collard Greens",
      "Garlic",
      "Ginger",
      "Oil",
      "Salt",
    ],
    discountPer: 0,
  },

  {
    id: "firfir",
    name: "Firfir",
    description:
      "Torn injera pieces sautéed in spiced berbere sauce. A beloved Ethiopian breakfast staple.",
    price: 200,
    category: "ethiopian",
    isFasting: false,
    spiceLevel: "Medium 🌶️",
    image: "/images/firfir.jpg",
    ingredients: [
      "Injera",
      "Berbere",
      "Onions",
      "Tomatoes",
      "Oil",
    ],
    discountPer: 0,
  },

  {
    id: "genfo",
    name: "Genfo",
    description:
      "Thick barley porridge served with a well of spiced butter and berbere. A warming breakfast.",
    price: 280,
    category: "ethiopian",
    isFasting: false,
    spiceLevel: "Mild 😊",
    image: "/images/Genfo.jpg",
    ingredients: [
      "Barley Flour",
      "Niter Kibbeh",
      "Berbere",
      "Water",
      "Salt",
    ],
    discountPer: 0,
  },

  {
    id: "ful-medames",
    name: "Ful Medames",
    description:
      "Stewed fava beans topped with olive oil, jalapeños, onions, and served with fresh bread.",
    price: 190,
    category: "ethiopian",
    isFasting: false,
    spiceLevel: "Mild 😊",
    image: "/images/ful.jpg",
    ingredients: [
      "Fava Beans",
      "Olive Oil",
      "Jalapeños",
      "Onions",
      "Lemon",
      "Bread",
    ],
    discountPer: 0,
  },

  {
    id: "coffee-buna",
    name: "Coffee/Buna",
    description:
      "Freshly roasted and brewed Ethiopian coffee served in a traditional jebena. A cultural ceremony.",
    price: 100,
    category: "hot-drinks",
    isFasting: true,
    spiceLevel: "Mild 😊",
    image: "/images/coffee.jpg",
    ingredients: [
      "Ethiopian Coffee Beans",
      "Water",
      "Sugar",
    ],
    discountPer: 0,
  },

  {
    id: "fresh-mango-juice",
    name: "Fresh Mango Juice",
    description:
      "Freshly blended mango juice with a hint of lime. Cool and refreshing.",
    price: 150,
    category: "juice-smoothie",
    isFasting: true,
    spiceLevel: "Mild 😊",
    image: "/images/mango.jpg",
    ingredients: [
      "Mango",
      "Lime",
      "Sugar",
      "Ice",
    ],
    discountPer: 15,
  },

  {
    id: "beyainatu",
    name: "Beyainatu",
    description:
      "A grand fasting sampler with shiro, misir, gomen, atkilt wot, and fresh injera. Vegetarian feast.",
    price: 380,
    category: "fasting",
    isFasting: true,
    spiceLevel: "Medium 🌶️",
    image: "/images/beyaynet.jpg",
    ingredients: [
      "Shiro",
      "Red Lentils",
      "Collard Greens",
      "Cabbage",
      "Potatoes",
      "Injera",
    ],
    discountPer: 10,
  },

  {
    id: "avocado-smoothie",
    name: "Avocado Smoothie",
    description:
      "Creamy avocado blended with milk and honey. Thick, healthy, and delicious.",
    price: 150,
    category: "juice-smoothie",
    isFasting: true,
    spiceLevel: "Mild 😊",
    image: "/images/avocado.jpg",
    ingredients: [
      "Avocado",
      "Milk",
      "Honey",
      "Ice",
    ],
    discountPer: 0,
  },

  {
    id: "classic-cheeseburger",
    name: "Classic Cheeseburger",
    description:
      "Juicy beef patty with melted cheddar, lettuce, tomato, and secret sauce on a brioche bun.",
    price: 1380,
    category: "burger",
    isFasting: false,
    spiceLevel: "Mild 😊",
    image: "/images/cheese.jpg",
    ingredients: [
      "Beef Patty",
      "Cheddar Cheese",
      "Lettuce",
      "Tomato",
      "Onion",
      "Brioche Bun",
      "Secret Sauce",
    ],
    discountPer: 10,
  },

  {
    id: "spicy-chicken-burger",
    name: "Spicy Chicken Burger",
    description:
      "Crispy fried chicken thigh with sriracha mayo, pickles, and coleslaw on a toasted bun.",
    price: 1350,
    category: "burger",
    isFasting: false,
    spiceLevel: "Medium 🌶️",
    image: "/images/chiken-burger.jpg",
    ingredients: [
      "Chicken Thigh",
      "Flour",
      "Sriracha Mayo",
      "Pickles",
      "Coleslaw",
      "Bun",
    ],
    discountPer: 0,
  },

  {
    id: "margherita-pizza",
    name: "Margherita Pizza",
    description:
      "Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil on wood-fired crust.",
    price: 1420,
    category: "pizza",
    isFasting: false,
    spiceLevel: "Mild 😊",
    image: "/images/margherita.jpg",
    ingredients: [
      "Pizza Dough",
      "San Marzano Tomatoes",
      "Mozzarella",
      "Fresh Basil",
      "Olive Oil",
    ],
    discountPer: 0,
  },

  {
    id: "special-pizza",
    name: "Special Pizza",
    description:
      "Loaded pepperoni pizza with mozzarella, tomato sauce, and a crispy golden crust.",
    price: 1400,
    category: "pizza",
    isFasting: false,
    spiceLevel: "Mild 😊",
    image: "/images/special.jpg",
    ingredients: [
      "Pizza Dough",
      "Pepperoni",
      "Mozzarella",
      "Tomato Sauce",
      "Oregano",
    ],
    discountPer: 0,
  },

  {
    id: "pasta",
    name: "Pasta",
    description:
      "Fettuccine tossed in a rich parmesan cream sauce with grilled chicken and garlic bread.",
    price: 1380,
    category: "pasta",
    isFasting: false,
    spiceLevel: "Mild 😊",
    image: "/images/pasta.jpg",
    ingredients: [
      "Fettuccine",
      "Heavy Cream",
      "Parmesan",
      "Garlic",
      "Grilled Chicken",
      "Parsley",
    ],
    discountPer: 10,
  },

  {
    id: "shay",
    name: "shay",
    description:
      "Aromatic Ethiopian spiced tea blended with cinnamon, cardamom, clove, and steamed milk.",
    price: 90,
    category: "hot-drinks",
    isFasting: true,
    spiceLevel: "Mild 😊",
    image: "/images/tea.jpg",
    ingredients: [
      "Ethiopian Tea",
      "Cinnamon",
      "Cardamom",
      "Clove",
      "Milk",
      "Sugar",
    ],
    discountPer: 0,
  },

  {
    id: "coca-cola",
    name: "Coca-Cola",
    description:
      "Classic ice-cold Coca-Cola. The perfect refreshment with any meal.",
    price: 40,
    category: "soft-drinks",
    isFasting: true,
    spiceLevel: "Mild 😊",
    image: "/images/coca.jpg",
    ingredients: [
      "Coca-Cola",
      "Ice",
    ],
    discountPer: 0,
  },

  {
    id: "fanta-orange",
    name: "Fanta Orange",
    description:
      "Refreshing Fanta Orange soda. Sweet, bubbly, and full of orange flavor.",
    price: 40,
    category: "soft-drinks",
    isFasting: true,
    spiceLevel: "Mild 😊",
    image: "/images/fanta.jpg",
    ingredients: [
      "Fanta Orange",
      "Ice",
    ],
    discountPer: 0,
  },

  {
    id: "sprite",
    name: "Sprite",
    description:
      "Crisp and lemony Sprite soda. Cool and refreshing.",
    price: 40,
    category: "soft-drinks",
    isFasting: true,
    spiceLevel: "Mild 😊",
    image: "/images/sprit.jpg",
    ingredients: [
      "Sprite",
      "Ice",
    ],
    discountPer: 0,
  },
];

export async function getDishes() {
  return dishes;
}