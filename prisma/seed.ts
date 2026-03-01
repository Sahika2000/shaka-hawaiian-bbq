import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
const prisma = new PrismaClient();

const menuData = {
  categories: [
    {
      name: "Appetizers & Sides",
      items: [
        { name: "Veggie Spring Rolls (2)", price: 3.49, description: null },
        { name: "Musubis (2)", price: 6.29, description: "A block of rice topped with a dash of teriyaki sauce, and a choice of protein wrapped in seaweed." },
        { name: "Crab Rangoon", price: 4.29, description: "Imitation crab meat, and cream cheese in crispy wonton skin." },
        { name: "Crispy Shrimp (6)", price: 8.29, description: "Crispy breaded shrimp served with katsu sauce." },
        { name: "Steamed Rice", price: 2.89, description: null },
        { name: "Curry Sauce", price: 2.99, description: null },
      ]
    },
    {
      name: "Gourmet Salads",
      items: [
        { name: "Green Mixed Salad", price: 4.29, description: "Shredded lettuce, shredded cabbage, carrots, onions, and edamame with our house made dressing." },
        { name: "Green Mixed Salad with Protein", price: 11.29, description: "Mixed green salad with a choice of BBQ chicken, grilled chicken breast (+0.50), fried white fish, crispy shrimp, or chicken katsu.", options: { protein_choices: ["BBQ Chicken", "Grilled Chicken Breast (+0.50)", "Fried White Fish", "Crispy Shrimp", "Chicken Katsu"] } },
        { name: "Macaroni Salad", price: 4.29, description: null },
      ]
    },
    {
      name: "Aloha Plate",
      items: [
        { name: "Aloha Plate", price: 11.29, description: "A choice of protein on a bed of steamed rice, and a side of green mix salad with house dressing.", options: { protein_choices: ["BBQ Chicken", "Chicken Katsu", "Teriyaki Chicken", "Fire Chicken (+0.75)", "Grilled Chicken Breast - Lemon Pepper (+0.75)", "Grilled Chicken Breast - Teriyaki (+0.75)", "BBQ Beef (+0.75)", "Kalua Pork (+0.75)", "Fried White Fish", "Crispy Shrimp (+0.75)"] } },
      ]
    },
    {
      name: "Family Meal",
      items: [
        { name: "Family Meal", price: 43.49, description: "A choice of 3 entrée items. Includes 6 scoops of steamed rice, 4 scoops of macaroni salad, and veggies.",options: {
  choice_of_1st_item: {
    required: true,
    items: [
      "BBQ Chicken",
      "Chicken Katsu",
      "Teriyaki Chicken",
      "Fire Chicken",
      "Curry Chicken",
      "Curry Chicken Katsu",
      "Kalua Pork",
      "Fried White Fish",
      "Grilled Chicken Breast - Lemon Pepper (+3.00)",
      "Grilled Chicken Breast - Teriyaki (+3.00)",
      "BBQ Beef (+3.00)",
      "Crispy Shrimp (+3.00)",
      "Kalbi Short Ribs (+6.00)"
    ]
  },
  choice_of_2nd_item: {
    required: true,
    items: [
      "BBQ Chicken",
      "Chicken Katsu",
      "Teriyaki Chicken",
      "Fire Chicken",
      "Curry Chicken",
      "Curry Chicken Katsu",
      "Kalua Pork",
      "Fried White Fish",
      "Grilled Chicken Breast - Lemon Pepper (+3.00)",
      "Grilled Chicken Breast - Teriyaki (+3.00)",
      "BBQ Beef (+3.00)",
      "Crispy Shrimp (+3.00)",
      "Kalbi Short Ribs (+6.00)"
    ]
  },
  choice_of_3rd_item: {
    required: true,
    items: [
      "BBQ Chicken",
      "Chicken Katsu",
      "Teriyaki Chicken",
      "Fire Chicken",
      "Curry Chicken",
      "Curry Chicken Katsu",
      "Kalua Pork",
      "Fried White Fish",
      "Grilled Chicken Breast - Lemon Pepper (+3.00)",
      "Grilled Chicken Breast - Teriyaki (+3.00)",
      "BBQ Beef (+3.00)",
      "Crispy Shrimp (+3.00)",
      "Kalbi Short Ribs (+6.00)"
    ]
  }
} },
      ]
    },
    {
      name: "Mini Meals",
      items: [
        { name: "Mini Meal", price: 8.99, description: "Includes 1 scoop of steamed rice, 1 scoop of macaroni salad, and veggies.", options: { entree_choices: ["BBQ Chicken", "Chicken Katsu", "Grilled Chicken Breast - Lemon Pepper (+0.50)", "Grilled Chicken Breast - Teriyaki (+0.50)", "Fire Chicken (+0.50)", "BBQ Beef (+0.50)", "Crispy Shrimp"] } },
      ]
    },
    {
      name: "Shaka Favorites",
      items: [
        { name: "Chicken Combo", price: 12.49, description: "A combination of our favorite BBQ chicken, and chicken katsu." },
        { name: "Hawaiian BBQ Mix", price: 14.79, description: "BBQ chicken, BBQ beef, and kalbi short ribs." },
        { name: "Seafood Mix", price: 13.49, description: "Crispy shrimp, white fish, and BBQ chicken." },
        { name: "BBQ & Katsu Mix", price: 13.49, description: "BBQ chicken, BBQ beef, and chicken katsu." },
        { name: "Shrimp & BBQ Chicken Combo", price: 12.99, description: "Savor our crispy shrimp along with Hawaiian BBQ chicken." },
        { name: "Fried White Fish & BBQ Chicken Combo", price: 12.99, description: "Our two most popular items BBQ chicken, and BBQ beef." },
        { name: "Chicken & Beef Combo", price: 12.99, description: "A combination of our crispy shrimp, and fried white fish." },
        { name: "Shrimp & White Fish Combo", price: 12.99, description: "A combination of our crispy shrimp and fried white fish." },
        { name: "Kalua Combo", price: 12.99, description: "Kalua pork with a choice of BBQ chicken, chicken katsu, or teriyaki chicken.", options: { protein_choices: ["BBQ Chicken", "Chicken Katsu", "Teriyaki Chicken"] } },
        { name: "Grilled Spam & Eggs", price: 11.29, description: "A true local dish - grilled spam with 2 eggs." },
        { name: "Loco Moco", price: 13.49, description: null },
      ]
    },
    {
      name: "Chicken",
      items: [
        { name: "Hawaiian BBQ Chicken", price: 11.29, description: "Grilled boneless and skinless chicken marinated in Hawaiian BBQ sauce." },
        { name: "Chicken Katsu", price: 11.29, description: "Crispy breaded chicken fillets." },
        { name: "Teriyaki Chicken", price: 11.29, description: "Grilled boneless chicken served with our house teriyaki sauce." },
        { name: "Fire Chicken", price: 12.49, description: "*Spicy* Chicken slices marinated in our special blend of spices then grilled with onions, and tossed with spicy fire sauce." },
        { name: "Curry Chicken", price: 12.49, description: null },
        { name: "Curry Chicken Katsu", price: 12.49, description: null },
      ]
    },
    {
      name: "Beef & Pork",
      items: [
        { name: "Kalbi Short Ribs", price: 16.29, description: "Beef short ribs cut Korean style, marinated in homemade teriyaki sauce and char-grilled." },
        { name: "Hawaiian BBQ Beef", price: 13.49, description: "Grilled slices of tender beef marinated in BBQ sauce." },
        { name: "Kalua Pork with Cabbage", price: 12.49, description: "Hawaii's version of the pulled pork. Slow roasted pork with a hint of smokey flavor, served over steamed cabbage." },
      ]
    },
    {
      name: "Seafood",
      items: [
        { name: "Fried White Fish", price: 12.49, description: "Fish fillet marinated, lightly breaded, then tenderly cooked." },
        { name: "Crispy Shrimp", price: 13.49, description: "Crispy breaded shrimp served with katsu sauce." },
      ]
    },
    {
      name: "Beverages",
      items: [
        { name: "Fountain Drink", price: 2.89, description: null },
        { name: "Fresh Young Coconut Juice", price: 4.99, description: null },
        { name: "Hawaiian Drinks / Bottled Drinks", price: 3.29, description: null },
        { name: "Bottled Water", price: 2.89, description: null },
      ]
    },
  ]
};

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();

  for (let catIdx = 0; catIdx < menuData.categories.length; catIdx++) {
    const cat = menuData.categories[catIdx];
    const category = await prisma.menuCategory.create({
      data: { name: cat.name, sortOrder: catIdx },
    });

    for (let itemIdx = 0; itemIdx < cat.items.length; itemIdx++) {
      const item = cat.items[itemIdx] as any;
      await prisma.menuItem.create({
        data: {
          categoryId: category.id,
          name: item.name,
          description: item.description,
          basePrice: item.price,
          options: item.options ?? null,
          sortOrder: itemIdx,
        },
      });
    }
  }

  console.log('Seeding complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
