const products = [
  {
    id: 1,
    name: "Altoparlant",
    category: "Audio",
    price: 12,
    image: "images/audio_box.jpg",
    description: "Altoparlant dhe zmadhues zëri cilësor për çdo ambient.",
    featured: false
  },
  {
    id: 2,
    name: "Brumashin dhe hillt",
    category: "Vegla Pune",
    price: 20,
    image: "images/brumashin_hillt.jpg",
    description: "Makinë pune profesionale për brumë dhe shpime (hilti).",
    featured: true
  },
  {
    id: 3,
    name: "Laptop Dell",
    category: "Laptops",
    price: 50,
    image: "images/dell_laptop.jpg",
    description: "Laptop Dell i përshtatshëm për punë zyre dhe shkollë.",
    featured: false
  },
  {
    id: 4,
    name: "Drite Led Ndriques",
    category: "Ndriçim",
    price: 15,
    image: "images/drite_2.jpg",
    description: "Ndriçues LED cilësor për tavolinë ose ambient pune.",
    featured: false
  },
  {
    id: 5,
    name: "Drite Ndriques",
    category: "Ndriçim",
    price: 15,
    image: "images/drite_drite.jpg",
    description: "Dritë ndriçuese LED për ambient të brendshëm.",
    featured: false
  },
  {
    id: 6,
    name: "Gps Tracker",
    category: "GPS & Aksesorë",
    price: 8,
    image: "images/gps_tracker.jpg",
    description: "Ndjekës GPS inteligjent për makina, kafshë ose çelësa.",
    featured: false
  },
  {
    id: 7,
    name: "GPS Tracker",
    category: "GPS & Aksesorë",
    price: 8,
    image: "images/gps_tracker2.jpg",
    description: "Ndjekës GPS mini me saktësi të lartë.",
    featured: false
  },
  {
    id: 8,
    name: "Laptop HP",
    category: "Laptops",
    price: 50,
    image: "images/hp_laptop.jpg",
    description: "Laptop HP me performancë të mirë për përdorim të përditshëm.",
    featured: false
  },
  {
    id: 9,
    name: "Laptop HP Workstation",
    category: "Laptops",
    price: 100,
    image: "images/hpworkstation_laptop.jpg",
    description: "Laptop HP Workstation profesional me fuqi të lartë procesimi.",
    featured: true
  },
  {
    id: 10,
    name: "Kamer Digjitale",
    category: "Kamera",
    price: 50,
    image: "images/kamer_digjitale.jpg",
    description: "Kamerë digjitale kompakte për kapjen e momenteve të bukura.",
    featured: false
  },
  {
    id: 11,
    name: "Kamer Profesionale",
    category: "Kamera",
    price: 45,
    image: "images/kamer_profesionale.jpg",
    description: "Kamerë profesionale DSLR për fotografi dhe video të qarta.",
    featured: true
  },
  {
    id: 12,
    name: "Kopjus i qipav /Programues",
    category: "Aksesorë",
    price: 25,
    image: "images/kopjus_qipash.jpg",
    description: "Programues dhe kopjues çipash profesional për pajisje elektronike.",
    featured: false
  },
  {
    id: 13,
    name: "Lapsa Digjital",
    category: "Aksesorë",
    price: 10,
    image: "images/lapsa_digjital.jpg",
    description: "Laps digjital (stylus) për tableta dhe telefonë inteligjentë.",
    featured: false
  },
  {
    id: 14,
    name: "Laps i Menqur",
    category: "Aksesorë",
    price: 4,
    image: "images/lapsi menqur_2.jpg",
    description: "Laps inteligjent me veti të veçanta digjitale.",
    featured: false
  },
  {
    id: 15,
    name: "Manikyr /Pedikyr",
    category: "Kujdesi Personal",
    price: 13,
    image: "images/msnikyr_pedikyr.jpg",
    description: "Aparat dhe set profesional për manikyr dhe pedikyr.",
    featured: false
  },
  {
    id: 16,
    name: "Ore e menqur(Smartwatch)",
    category: "Orë",
    price: 10,
    image: "images/ore_menqur.jpg",
    description: "Orë inteligjente me matës hapash dhe njoftime telefoni.",
    featured: false
  },
  {
    id: 17,
    name: "Ore e Menqur(SmartWatch)",
    category: "Orë",
    price: 15,
    image: "images/ore_menqur2.jpg",
    description: "Orë e mençur me dizajn elegant dhe sensorë shëndetësorë.",
    featured: false
  },
  {
    id: 18,
    name: "Samsung Galaxy Xcover",
    category: "Telefona",
    price: 10,
    image: "images/samsung_xcover.jpg",
    description: "Telefon Samsung Galaxy Xcover rezistent ndaj goditjeve.",
    featured: false
  },
  {
    id: 19,
    name: "Samsung Galaxy S3 Mini",
    category: "Telefona",
    price: 10,
    image: "images/samsungs3_mini.jpg",
    description: "Telefon Samsung Galaxy S3 Mini klasik dhe kompakt.",
    featured: false
  },
  {
    id: 20,
    name: "SmartWatch Xiamoi",
    category: "Orë",
    price: 50,
    image: "images/smartwatch_xioami.jpg",
    description: "Smartwatch Xiaomi me bateri afatgjatë dhe ekran AMOLED.",
    featured: true
  },
  {
    id: 21,
    name: "Termometer Digjital Mates",
    category: "Aksesorë",
    price: 18,
    image: "images/termomter_mates.jpg",
    description: "Termometër digjital matës me saktësi të lartë.",
    featured: false
  }
];

// Export if running in Node environment (for testing), or expose globally for browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = products;
}
