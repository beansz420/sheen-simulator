import tube from "@/assets/product-tube.jpg";
import model from "@/assets/product-model.jpg";
import blue from "@/assets/product-blue.jpg";

export function ProductGallery() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <img src={tube} alt="Creme clareador" className="aspect-square w-full rounded-2xl bg-secondary object-cover" width={1024} height={1024} />
      <img src={model} alt="Modelo usando o creme" className="aspect-square w-full rounded-2xl object-cover" width={1024} height={1024} />
      <img src={blue} alt="Textura do creme" className="aspect-square w-full rounded-2xl object-cover" width={1024} height={1024} loading="lazy" />
      <img src={tube} alt="Embalagem do produto" className="aspect-square w-full rounded-2xl bg-secondary object-cover" width={1024} height={1024} loading="lazy" />
    </div>
  );
}
