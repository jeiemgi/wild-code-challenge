import image1 from "@/assets/images/image01.jpg";
import image2 from "@/assets/images/image02.jpg";
import image3 from "@/assets/images/image03.jpg";
import image4 from "@/assets/images/image04.jpg";
import image5 from "@/assets/images/image05.jpg";

import bg1 from "@/assets/images/blur-01.png";
import bg2 from "@/assets/images/blur-02.png";
import bg3 from "@/assets/images/blur-03.png";
import bg4 from "@/assets/images/blur-04.png";
import bg5 from "@/assets/images/blur-05.png";

const data = [
  {
    title: "Everyday Flowers",
    image: image1,
    background: bg1,
  },
  {
    title: "The wilder Night",
    image: image2,
    background: bg2,
  },
  {
    title: "Smooth Memories",
    image: image3,
    background: bg3,
  },
  {
    title: "The Future Universe",
    image: image4,
    background: bg4,
  },
  {
    title: "She Was Born Urban",
    image: image5,
    background: bg5,
  },
];

export type DataType = typeof data;

export default data;
