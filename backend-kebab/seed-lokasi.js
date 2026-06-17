const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dataLokasi = [
  {
    namaKota: 'Cikarang',
    cabang: [
      { name: "Roti Kopi D'Grande Pilar", url: "https://maps.app.goo.gl/Jt1B9wmSmLcx4Gu89" },
      { name: "Roti Kopi D'Grande Cikarang", url: "https://maps.app.goo.gl/vJnMMUXK2Poqu5hC8" },
      { name: "Medirosa", url: "https://maps.app.goo.gl/jaiqQMMVPvqfXi837" },
      { name: "Pelaukan", url: "https://maps.app.goo.gl/EYuywV8noddFxzUL9" },
      { name: "Persada", url: "https://maps.app.goo.gl/juoArVCddHKPDgqC6" },
      { name: "Puri Nirwana", url: "https://maps.app.goo.gl/KfzX7xpDWCyLxWEd8" },
      { name: "Libersa", url: "https://maps.app.goo.gl/PfCWmVVTRKWC765H6" },
      { name: "GCC", url: "https://maps.app.goo.gl/apV6wU5a75ZyTi339" },
      { name: "Citarik", url: "https://maps.app.goo.gl/MHy4FawqVde62nNP6" },
      { name: "Bugel Salam", url: "https://maps.app.goo.gl/nxoyeUNvAYMG1XEN7" },
      { name: "Indomaret Tegal Danas", url: "https://maps.app.goo.gl/6APHFpMMk6s28z839" },
      { name: "Alfamidi Cikarang Baru", url: "https://maps.app.goo.gl/LrPpJcjk4AycNVGv5" },
      { name: "Indomaret Jatiwangi", url: "https://maps.app.goo.gl/95eigQ2oFvtvMB7d7" },
      { name: "Indomaret Cicau Raya", url: "https://maps.app.goo.gl/tkWPzWgV428w9AjN7" },
      { name: "Rawa Sentul", url: "https://maps.app.goo.gl/cTEZUXJi95tBNSXg9" },
      { name: "Brigif", url: "https://maps.app.goo.gl/PCLJSjqvYG2tWvz66" },
      { name: "Rusa Raya", url: "https://maps.app.goo.gl/vw6N7NJxNh9fmJFU8" },
      { name: "Mattel", url: "https://maps.app.goo.gl/eLtCTKKcYGBCYE3B7" },
      { name: "Ruko Paragon Lippo", url: "https://maps.app.goo.gl/5xWXHiKKMr6gHCJHA" }
    ]
  },
  {
    namaKota: 'Bekasi',
    cabang: [
      { name: "Wisma Asri", url: "https://maps.app.goo.gl/fpETzZVh9gmSwLfp6" },
      { name: "Tarumajaya", url: "https://maps.app.goo.gl/P2yJaNJvPfdKC99j6" },
      { name: "Alamanda", url: "https://maps.app.goo.gl/sy9MZWGT64PXCqGR8" },
      { name: "Vilmut", url: "https://maps.app.goo.gl/b8PtG6HaAKa2m8og6" },
      { name: "Gabus", url: "https://maps.app.goo.gl/9DoVtsXWGLPkq6NZ7" }
    ]
  },
  {
    namaKota: 'Bogor',
    cabang: [
      { name: "Citeureup", url: "https://maps.app.goo.gl/mZASuGVGXPw5wE2t6" },
      { name: "Klapa Nunggal", url: "https://maps.app.goo.gl/WCdU4wAETfwD9Nra7" },
      { name: "Cicadas", url: "https://maps.app.goo.gl/zemjFZ7iia46Y1bQ6" },
      { name: "Wanaherang", url: "https://maps.app.goo.gl/a6d6DXAvdh9XMyEt8" }
    ]
  },
  {
    namaKota: 'Tangerang',
    cabang: [
      { name: "SUKAMANA", url: "https://maps.app.goo.gl/XXKxKoAwQcYHNmdk7" },
      { name: "MALABAR", url: "https://maps.app.goo.gl/q15Ecyh2gjPhBJrL9" },
      { name: "JATIWARINGIN", url: "https://maps.app.goo.gl/ezMG5TdTjhmu8zXf8" },
      { name: "RAJEG MULYA", url: "https://maps.app.goo.gl/7NLSCG7wn6nHfSKX8" },
      { name: "BUGEL MARGASARI", url: "https://maps.app.goo.gl/jrA5RbigXYgCNmzDA" },
      { name: "ELOK", url: "https://maps.app.goo.gl/mEWnwr4DxMPjebKLA" },
      { name: "KUTABUMI", url: "https://maps.app.goo.gl/1LuLVVkiHWxS4jLz8" },
      { name: "PERUMAHAN TAMAN BUAH 2", url: "https://maps.app.goo.gl/MhZaqfjwqovgw1xN6" }
    ]
  },
  {
    namaKota: 'Karawang',
    cabang: [
      { name: "KLARI", url: "https://maps.app.goo.gl/UNEZwmWc7mtRcUiY9" },
      { name: "CITRA KEBUN MAS", url: "https://maps.app.goo.gl/DqLxbsjvZEke7DpK9" },
      { name: "PERUMNAS", url: "https://maps.app.goo.gl/yBo7WBuV7mi4ofc67" },
      { name: "TUPAREV", url: "https://maps.app.goo.gl/uf6yTkRNT27FX8Rb6" },
      { name: "KARANG PAWITAN", url: "https://maps.app.goo.gl/79592z5fPQSkW1Qy9" },
      { name: "JOHAR", url: "https://maps.app.goo.gl/jZbYoQJPUwpPpokG6" },
      { name: "BAYUKARTA", url: "https://maps.app.goo.gl/eD3jgjfcXrWdmF8VA" },
      { name: "TANJUNG PURA", url: "https://maps.app.goo.gl/tLB76Y1BmnZu1QHA9" },
      { name: "NIAGA", url: "https://maps.app.goo.gl/vYGoDJb53xDELwsU6" },
      { name: "CENGKONG", url: "https://maps.app.goo.gl/WQtB9oJNdaP3v76h8" },
      { name: "LAMARAN", url: "https://maps.app.goo.gl/VYjsNDYuNXeqGGNw7" }
    ]
  },
  {
    namaKota: 'Cikampek',
    cabang: [
      { name: "PANGULAH", url: "https://maps.app.goo.gl/pnakucAhxedxXzXJ6" },
      { name: "PAWARENGAN", url: "https://maps.app.goo.gl/w867seRdsC9z8SsE6" },
      { name: "CIKOPO", url: "https://maps.app.goo.gl/69cKRTpvt5wK38HC7" },
      { name: "JL STASIUN", url: "https://maps.app.goo.gl/nFmyJTqWUAi5fYPo8" },
      { name: "NICESO KOTA BARU", url: "https://maps.app.goo.gl/ykGSgPmj6TEkr9PG6" },
      { name: "SUKA SEURI", url: "https://maps.app.goo.gl/he4UK7hsXJwTyS6M9" },
      { name: "AMANDA JL. IR H JUANDA", url: "https://maps.app.goo.gl/zfnAfvbfCWExn7DB9" }
    ]
  },
  {
    namaKota: 'Purwakarta',
    cabang: [
      { name: "STASIUN", url: "https://maps.app.goo.gl/1S7qxLWPyuYoWmFf7" },
      { name: "GS JL JENDRAL SUDIRMAN", url: "https://maps.app.goo.gl/GY6sCb1md4AHqnb3A" },
      { name: "GIANT JL TAMAN PAHLAWAN", url: "https://maps.app.goo.gl/ZdNnqJqQ4qaWKbcRA" },
      { name: "CITEKO", url: "https://maps.app.goo.gl/bqir6H7KuD55ZfF36" },
      { name: "JL PLERED RAYA", url: "https://maps.app.goo.gl/Se9WjVrPSCBZwPwu8" },
      { name: "KAPTEN HALIM", url: "https://maps.app.goo.gl/g4b8GizELaGketoh7" },
      { name: "JL RAWA SARI", url: "https://maps.app.goo.gl/2n99hiiBmazqQVbN6" },
      { name: "PASAR REBO", url: "https://maps.app.goo.gl/9Bwa3JoeVKr9rMdUA" },
      { name: "IPIK", url: "https://maps.app.goo.gl/aYhVygRw3d8PUvf77" }
    ]
  },
  {
    namaKota: 'Bandung',
    cabang: [
      { name: "TAMAN MAKAM PAHLAWAN", url: "https://maps.app.goo.gl/ciJGAhkP8afALXdm8" },
      { name: "BORMA DAGO", url: "https://maps.app.goo.gl/utfjQkfeZGSkEiqU7" },
      { name: "CIBADUYUT", url: "https://maps.app.goo.gl/m3epFnjz6HQwDAoR8" },
      { name: "MELONG", url: "https://maps.app.goo.gl/m3epFnjz6HQwDAoR8" },
      { name: "GEGERKALONG DARUT TAUHID", url: "https://maps.app.goo.gl/fRVJp3i6GFatz69i7" },
      { name: "GEMPOL", url: "https://maps.app.goo.gl/FrLwVZPZEkjz5f9t8" },
      { name: "CIMINDI", url: "https://maps.app.goo.gl/ViJGsF8oiQPh8Nvk7" },
      { name: "SUKAMENAK", url: "https://maps.app.goo.gl/FCG752o748d2w3bH9" },
      { name: "MARGAASIH", url: "https://maps.app.goo.gl/k6zK9iHCexM6HEYK8" },
      { name: "BAROS", url: "https://maps.app.goo.gl/UHwX3yG4D3cBpQYQ7" },
      { name: "DUSTIRA", url: "https://maps.app.goo.gl/E1TMNhxMf1jHLWYE6" },
      { name: "LEUWIGAJAH", url: "https://maps.app.goo.gl/3RmBSqLMjaB4puCp8" },
      { name: "PERMATA", url: "https://maps.app.goo.gl/jgNAzTHqXCdSkiR37" },
      { name: "RANCAMANYAR", url: "https://maps.app.goo.gl/JyBWagoQRY2B1wMSA" },
      { name: "SAYANG", url: "https://maps.app.goo.gl/HekDg2nimk9nFBmw8" },
      { name: "ALUN ALUN BANJARAN 1", url: "https://maps.app.goo.gl/ZTZ2R6mDQ2RR8QLf8" },
      { name: "ALUN ALUN BANJARAN 2", url: "https://maps.app.goo.gl/zsgLSk8STf3oy6kP8" }
    ]
  },
  {
    namaKota: 'Subang',
    cabang: [
      { name: "ROTI KOPI D'GRANDE", url: "https://maps.app.goo.gl/QX9jRAqPxx9MgNFY7" },
      { name: "KALIJATI", url: "https://maps.app.goo.gl/iAt2ocP9kA8Q7Ryv7" },
      { name: "TAEKWANG", url: "https://maps.app.goo.gl/srYmr957VKmTzKun6" },
      { name: "INDOPERUM", url: "https://maps.app.goo.gl/tbLat5k1PeEGo5NW6" },
      { name: "PD 2", url: "https://maps.app.goo.gl/6NQZst6Ef3KqWb1F7" },
      { name: "PD 3", url: "https://maps.app.goo.gl/exNJBVZqCuTwPeCMA" },
      { name: "PUJASERA", url: "https://maps.app.goo.gl/gNAjWb9uCZDvcPcR7" },
      { name: "ALUN ALUN", url: "https://maps.app.goo.gl/Kt8PPbcu9n6EcuWX8" }
    ]
  },
  {
    namaKota: 'Majalengka',
    cabang: [
      { name: "Babakan Jawa", url: "https://maps.app.goo.gl/BFbCkNMdvRMezYLJ8" },
      { name: "Ds Gandu", url: "https://maps.app.goo.gl/wG1ALzMHrp9atq7g9" },
      { name: "Dk Waru", url: "https://maps.app.goo.gl/ojgeayoSTvTVyhhv7" },
      { name: "Kasokandel", url: "https://maps.app.goo.gl/q8XyaQ8chQwNeX8m6" },
      { name: "Pasar Kadipaten", url: "https://maps.app.goo.gl/xofNKCYucjpHosuK9" }
    ]
  }
];

async function main() {
  console.log("Mulai memasukkan data Lokasi Kota dan Outlet...");

  for (const kota of dataLokasi) {
    // 1. Buat data Kota dulu
    const cityRecord = await prisma.city.create({
      data: { name: kota.namaKota }
    });

    console.log(`✅ Kota ${kota.namaKota} berhasil ditambahkan!`);

    // 2. Siapin data outlet biar langsung tersambung ke ID kota tersebut
    const outletData = kota.cabang.map(cabang => ({
      name: cabang.name,
      address: `Cabang ${cabang.name}`, // Data sementara buat menuhin syarat database
      gmaps_url: cabang.url,
      cityId: cityRecord.id
    }));

    // 3. Masukin semua outlet di kota itu sekaligus
    await prisma.outlet.createMany({
      data: outletData
    });
  }

  console.log("Selesai! Semua data lokasi berhasil dimasukkan ke database.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });