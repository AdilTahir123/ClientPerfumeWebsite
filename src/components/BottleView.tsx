import Bottle360 from "./Bottle360";
import FeaturedBottle from "./FeaturedBottle";

// With 4+ angle photos: a real 360° spin. Otherwise the single photo on the tilting card.
export default function BottleView({ image, alt, angles, priority }: { image: string; alt: string; angles: string[]; priority?: boolean }) {
  return angles.length >= 4 ? <Bottle360 frames={angles} alt={alt} /> : <FeaturedBottle image={image} alt={alt} priority={priority} />;
}
