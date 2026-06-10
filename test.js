const productImagesMap = {
  "./assets/images/produits/Simaflex-Roll-Packed.jpeg": "data_url1",
  "./assets/images/produits/Simaflex-Antistress.png": "data_url2"
};
const resolveProductImage = (name, defaultImg) => {
  if (!name) return defaultImg;
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const path of Object.keys(productImagesMap)) {
    const filename = path.split("/").pop() || "";
    const namePart = filename.replace(/^Simaflex-?\s*/i, "").replace(/\.(png|jpe?g|webp)$/i, "");
    const normalizedFile = namePart.toLowerCase().replace(/[^a-z0-9]/g, "");
    console.log(`Checking ${normalizedName} == ${normalizedFile}`);
    if (normalizedFile === normalizedName) {
      return productImagesMap[path];
    }
  }
  return defaultImg;
};
console.log(resolveProductImage("Roll-Packed", "def"));
