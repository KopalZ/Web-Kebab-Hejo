const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses bersih-bersih data lokasi...");

  // Hapus data Outlet dulu (karena dia numpang ke City)
  const hapusOutlet = await prisma.outlet.deleteMany();
  console.log(`🧹 ${hapusOutlet.count} data Outlet lama berhasil dihapus.`);

  // Hapus data City
  const hapusCity = await prisma.city.deleteMany();
  console.log(`🧹 ${hapusCity.count} data Kota lama berhasil dihapus.`);

  console.log("✅ Database lokasi sudah bersih! Silakan jalankan ulang seed-lokasi.js");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());