const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Mulai memasukkan data menu...");

  // 1. Bikin Kategori
  const catKebabPot = await prisma.category.create({ data: { name: 'Kebab Pot' } });
  const catKebab = await prisma.category.create({ data: { name: 'Kebab' } });
  const catBurger = await prisma.category.create({ data: { name: 'Burger' } });
  const catHotdog = await prisma.category.create({ data: { name: 'HotDog' } });
  const catPizza = await prisma.category.create({ data: { name: 'Pizza' } });
  const catCanai = await prisma.category.create({ data: { name: 'Canai' } });

  // 2. Bikin Menu Kebab Pot
  await prisma.product.createMany({
    data: [
      { name: 'Kebab Pot', price: 20000, categoryId: catKebabPot.id, image_url: 'kebab-pot-default.jpg' },
      { name: 'Kebab Pot Sosis', price: 23000, categoryId: catKebabPot.id, image_url: 'kebab-pot-default.jpg' },
      { name: 'Kebab Pot Chicken', price: 23000, categoryId: catKebabPot.id, image_url: 'kebab-pot-default.jpg' },
      { name: 'Mix Kebab Pot', price: 26000, categoryId: catKebabPot.id, image_url: 'kebab-pot-default.jpg' },
    ]
  });

  // 3. Bikin Menu Kebab Hejo
  await prisma.product.createMany({
    data: [
      { name: 'Beef Kejo S', price: 10000, categoryId: catKebab.id, image_url: 'kebab-default.jpg' },
      { name: 'Beef Kejo M', price: 12000, categoryId: catKebab.id, image_url: 'kebab-default.jpg' },
      { name: 'Beef Kejo L', price: 15000, categoryId: catKebab.id, image_url: 'kebab-default.jpg' },
      { name: 'Sosis Kejo M', price: 15000, categoryId: catKebab.id, image_url: 'kebab-default.jpg' },
      { name: 'Sosis Kejo L', price: 18000, categoryId: catKebab.id, image_url: 'kebab-default.jpg' },
    ]
  });

  // 4. Bikin Menu Burger
  await prisma.product.createMany({
    data: [
      { name: 'Kebab Burger', price: 10000, categoryId: catBurger.id, image_url: 'burger-default.jpg' },
      { name: 'Chicken Burger', price: 13000, categoryId: catBurger.id, image_url: 'burger-default.jpg' },
      { name: 'Cheese Burger', price: 13000, categoryId: catBurger.id, image_url: 'burger-default.jpg' },
      { name: 'Mix Burger', price: 16000, categoryId: catBurger.id, image_url: 'burger-default.jpg' },
    ]
  });

  // 5. Bikin Menu HotDog
  await prisma.product.createMany({
    data: [
      { name: 'Kebab HotDog', price: 10000, categoryId: catHotdog.id, image_url: 'hotdog-default.jpg' },
      { name: 'Sosis HotDog', price: 13000, categoryId: catHotdog.id, image_url: 'hotdog-default.jpg' },
      { name: 'Chicken HotDog', price: 13000, categoryId: catHotdog.id, image_url: 'hotdog-default.jpg' },
      { name: 'Mix HotDog', price: 16000, categoryId: catHotdog.id, image_url: 'hotdog-default.jpg' },
    ]
  });

  // 6. Bikin Menu Pizza
  await prisma.product.createMany({
    data: [
      { name: 'Pizza Kebab', price: 20000, categoryId: catPizza.id, image_url: 'pizza-default.jpg' },
      { name: 'Pizza Sosis', price: 23000, categoryId: catPizza.id, image_url: 'pizza-default.jpg' },
      { name: 'Pizza Chicken', price: 23000, categoryId: catPizza.id, image_url: 'pizza-default.jpg' },
      { name: 'Pizza Spesial', price: 26000, categoryId: catPizza.id, image_url: 'pizza-default.jpg' },
    ]
  });

  // 7. Bikin Menu Canai
  await prisma.product.createMany({
    data: [
      { name: 'Canai Original', price: 10000, categoryId: catCanai.id, image_url: 'canai-default.jpg' },
      { name: 'Canai Coklat', price: 12000, categoryId: catCanai.id, image_url: 'canai-default.jpg' },
      { name: 'Canai Keju', price: 12000, categoryId: catCanai.id, image_url: 'canai-default.jpg' },
      { name: 'Canai Mix', price: 15000, categoryId: catCanai.id, image_url: 'canai-default.jpg' },
    ]
  });

  console.log("Selesai! Semua data menu berhasil dimasukkan ke database.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });