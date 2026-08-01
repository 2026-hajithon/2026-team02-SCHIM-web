import { useEffect, useState } from "react";

function useCanvasImage(src) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!src) {
      return undefined;
    }

    const nextImage = new Image();

    nextImage.onload = () => setImage(nextImage);
    nextImage.src = src;

    return () => {
      nextImage.onload = null;
    };
  }, [src]);

  return image;
}

export default useCanvasImage;
