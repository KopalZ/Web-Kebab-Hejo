const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Mulai update gambar massal...");

  // Bikin daftar update-nya: nama kategori -> nama file gambar
  const pembaruanGambar = [
    { kategori: 'Kebab Pot', file: 'kebab-pot.png' },
    { kategori: 'Kebab', file: 'kebab.jpg' },
    { kategori: 'Burger', file: 'burger.jpg' },
    { kategori: 'HotDog', file: 'burger.jpg' }, // Hotdog sementara pakai burger dulu ya kalau belum ada
    { kategori: 'Pizza', file: 'pizza.jpg' },
    { kategori: 'Canai', file: 'canai.jpg' }
  ];

  for (const item of pembaruanGambar) {
    // Cari ID kategori berdasarkan namanya
    const kategoriDB = await prisma.category.findFirst({
      where: { name: item.kategori }
    });

    if (kategoriDB) {
      // Update SEMUA produk yang punya ID kategori tersebut
      const hasil = await prisma.product.updateMany({
        where: { categoryId: kategoriDB.id },
        data: { image_url: item.file }
      });
      console.log(`✅ Gambar ${item.kategori} diupdate untuk ${hasil.count} menu.`);
    }
  }

  console.log("Selesai! Semua gambar sudah terupdate.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());