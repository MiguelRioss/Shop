import ProductCarousel from "../components/ProductsCarrousell/ProductsCarousel";

function IndvidualPageProduct(product ,products) {
const otherProducts = products.filter((it) => {it.id != product.id}) 
  return (
    <div className="w-full">
      <div className="w-3xl">
        <h1> Cart Container</h1>
        <div className={desktopImgWrapClass}>
          <img src={product.image} alt="Product" className={desktopImgClass} />
        </div>

        <ProductCarousel products={otherProducts}/> 
      </div>
    </div>
  );
}
