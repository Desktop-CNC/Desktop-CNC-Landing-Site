import { useState, useEffect } from 'react';
import { Carousel as RBAsAny } from 'react-bootstrap';
const Carousel = RBAsAny as any;

interface Props {
  owner: string,
  repo: string, 
  root: string
  files: string[]
}

function CarouselImages({owner, repo, root, files}: Props) {
  const [index, setIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    const fetchImages = async () => {
      const loadedUrls: string[] = [];

      for (const file of files) {
        try {
          const url = `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/main/${root}/${file}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Error: ${res.status}`);

          const blob = await res.blob();
          const localUrl = URL.createObjectURL(blob);
          loadedUrls.push(localUrl);
        } catch (e) {
          console.error("Failed to load image:", e);
        }
      }
      setImageUrls(loadedUrls);
    };

    fetchImages();
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [owner, repo, root, files]);


  return (
    <Carousel interval={3000} activeIndex={index} onSelect={handleSelect}>
      {imageUrls.map((url, index) => (
      <Carousel.Item key={index}>
        <img
          className="d-block w-100"
          src={url}
          alt={`Slide ${index}`}
          style={{ height: "500px", width: "10%", objectFit:"cover"}}
        />
    </Carousel.Item>
  ))}  
    </Carousel>
  );
}

export default CarouselImages;