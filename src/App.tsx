// import GalleryUI from "./components/Gallery/GalleryUI.tsx";
import Gallery from "./components/Gallery/Gallery.tsx";
import "@/App.css";

import image1 from '@/assets/images/image01.jpg'
import image2 from '@/assets/images/image02.jpg'
import image3 from '@/assets/images/image03.jpg'
import image4 from '@/assets/images/image04.jpg'
import image5 from '@/assets/images/image05.jpg'


const data = [
  {
    title: "Everyday Flowers",
    image: image1,
  },
  {
    title: "The wilder Night",
    image: image2,
  },
  {
    title: "Smooth Memories",
    image: image3,
  },
  {
    title: "The Future Universe",
    image: image4,
  },
  {
    title: "She Was Born Urban",
    image: image5,
  },
];

export type DataType = typeof data;

function App() {
  return (
    <>
      {/*<GalleryUI data={data} />*/}
      <Gallery data={data} />
    </>
  );
}

export default App;
