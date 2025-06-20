const shapeSelect = document.getElementById("shape-select");
const calcTypeSelect = document.getElementById("calc-type-select");
const calcTypeLabel = document.getElementById("calc-type-label");
const inputForm = document.getElementById("input-form");
const resultDiv = document.getElementById("result");

// Opsi perhitungan berdasarkan bangun
const calcOptions = {
  "persegi": ["Luas", "Keliling", "Sisi"],
  "persegi-panjang": ["Luas", "Keliling", "Panjang", "Lebar"],
  "segitiga": ["Luas", "Alas", "Tinggi"],
  "jajar-genjang": ["Luas", "Alas", "Tinggi"],
  "belah-ketupat": ["Luas", "Diagonal 1", "Diagonal 2"],
  "layang-layang": ["Luas", "Diagonal 1", "Diagonal 2"],
  "trapesium": ["Luas", "Sisi Atas", "Sisi Bawah", "Tinggi"],
  "lingkaran": ["Luas", "Keliling", "Jari-jari"],
  "kubus": ["Volume", "Luas Permukaan", "Sisi"],
  "balok": ["Volume", "Panjang", "Lebar", "Tinggi"],
  "prisma-segitiga": ["Volume", "Alas", "Tinggi Segitiga", "Tinggi Prisma"],
  "tabung": ["Volume", "Jari-jari", "Tinggi"],
  "limas-segitiga": ["Volume", "Alas", "Tinggi Segitiga", "Tinggi Limas"],
  "limas-segiempat": ["Volume", "Sisi", "Tinggi"],
  "kerucut": ["Volume", "Jari-jari", "Tinggi"],
  "bola": ["Volume", "Jari-jari"]
};

// Input form untuk tiap kombinasi
const inputTemplates = {
  "persegi": {
    "Luas": ["sisi"],
    "Keliling": ["sisi"],
    "Sisi": ["luas"]
  },
  "persegi-panjang": {
    "Luas": ["panjang", "lebar"],
    "Keliling": ["panjang", "lebar"],
    "Panjang": ["luas", "lebar"],
    "Lebar": ["luas", "panjang"]
  },
  "segitiga": {
    "Luas": ["alas", "tinggi"],
    "Alas": ["luas", "tinggi"],
    "Tinggi": ["luas", "alas"]
  },
  "jajar-genjang": {
    "Luas": ["alas", "tinggi"],
    "Alas": ["luas", "tinggi"],
    "Tinggi": ["luas", "alas"]
  },
  "belah-ketupat": {
    "Luas": ["d1", "d2"],
    "Diagonal 1": ["luas", "d2"],
    "Diagonal 2": ["luas", "d1"]
  },
  "layang-layang": {
    "Luas": ["d1", "d2"],
    "Diagonal 1": ["luas", "d2"],
    "Diagonal 2": ["luas", "d1"]
  },
  "trapesium": {
    "Luas": ["a", "b", "tinggi"],
    "Sisi Atas": ["luas", "b", "tinggi"],
    "Sisi Bawah": ["luas", "a", "tinggi"],
    "Tinggi": ["luas", "a", "b"]
  },
  "lingkaran": {
    "Luas": ["jari"],
    "Keliling": ["jari"],
    "Jari-jari": ["luas"]
  },
  "kubus": {
    "Volume": ["sisi"],
    "Luas Permukaan": ["sisi"],
    "Sisi": ["volume"]
  },
  "balok": {
    "Volume": ["panjang", "lebar", "tinggi"],
    "Panjang": ["volume", "lebar", "tinggi"],
    "Lebar": ["volume", "panjang", "tinggi"],
    "Tinggi": ["volume", "panjang", "lebar"]
  },
  "prisma-segitiga": {
    "Volume": ["alas", "tinggiSegitiga", "tinggiPrisma"],
    "Alas": ["volume", "tinggiSegitiga", "tinggiPrisma"],
    "Tinggi Segitiga": ["volume", "alas", "tinggiPrisma"],
    "Tinggi Prisma": ["volume", "alas", "tinggiSegitiga"]
  },
  "tabung": {
    "Volume": ["jari", "tinggi"],
    "Jari-jari": ["volume", "tinggi"],
    "Tinggi": ["volume", "jari"]
  },
  "limas-segitiga": {
    "Volume": ["alas", "tinggiSegitiga", "tinggiLimas"],
    "Alas": ["volume", "tinggiSegitiga", "tinggiLimas"],
    "Tinggi Segitiga": ["volume", "alas", "tinggiLimas"],
    "Tinggi Limas": ["volume", "alas", "tinggiSegitiga"]
  },
  "limas-segiempat": {
    "Volume": ["sisi", "tinggi"],
    "Sisi": ["volume", "tinggi"],
    "Tinggi": ["volume", "sisi"]
  },
  "kerucut": {
    "Volume": ["jari", "tinggi"],
    "Jari-jari": ["volume", "tinggi"],
    "Tinggi": ["volume", "jari"]
  },
  "bola": {
    "Volume": ["jari"],
    "Jari-jari": ["volume"]
  }
};

// Saat memilih bangun
shapeSelect.addEventListener("change", () => {
  const selectedShape = shapeSelect.value;
  const options = calcOptions[selectedShape];
  if (!options) return;

  // Tampilkan dropdown ke-2
  calcTypeLabel.style.display = "block";
  calcTypeSelect.style.display = "block";

  // Reset opsi dropdown
  calcTypeSelect.innerHTML = "";
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    calcTypeSelect.appendChild(option);
  });

  // Kosongkan form dan hasil
  inputForm.innerHTML = "";
  resultDiv.innerHTML = "";
});

// Saat memilih jenis perhitungan
calcTypeSelect.addEventListener("change", () => {
  const shape = shapeSelect.value;
  const calcType = calcTypeSelect.value;
  const inputs = inputTemplates[shape][calcType];

  inputForm.innerHTML = "";

  if (!inputs) return;

  inputs.forEach((input) => {
    const label = document.createElement("label");
    label.for = input;
    label.textContent = input.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    const field = document.createElement("input");
    field.type = "number";
    field.id = input;
    field.required = true;

    inputForm.appendChild(label);
    inputForm.appendChild(field);
  });

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Hitung";
  button.onclick = () => calculate(shape, calcType);

  inputForm.appendChild(button);
});

// Fungsi menghitung (dipersingkat di sini - LENGKAP versi sebelumnya)
function calculate(shape, calcType) {
  const val = id => parseFloat(document.getElementById(id)?.value) || 0;
  const π = Math.PI;
  let hasil = '';

  // ... SELURUH ISI calculate() dari versi sebelumnya ditempatkan di sini ...

  resultDiv.innerHTML = hasil || 'Perhitungan gagal.';
}
