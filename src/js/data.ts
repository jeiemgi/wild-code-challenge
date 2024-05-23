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
    subtitle: "Johanna Hobel for VOUGUE",
    date: "DEC 2019",
    image: {
      url: image1,
      alt: "This is the alt image",
    },
    background: bg1,
  },
  {
    title: "The wilder Night",
    subtitle: "Johanna Hobel for WILD",
    date: "DEC 2019",
    image: {
      url: image2,
      alt: "This is the alt image",
    },
    background: bg2,
  },
  {
    title: "Smooth Memories",
    subtitle: "Johanna Hobel for CHANEL",
    date: "DEC 2019",
    image: {
      url: image3,
      alt: "This is the alt image",
    },
    background: bg3,
  },
  {
    title: "The Future Universe",
    subtitle: "Johanna Hobel for ON",
    date: "DEC 2019",
    image: {
      url: image4,
      alt: "This is the alt image",
    },
    background: bg4,
  },
  {
    title: "She Was Born Urban",
    subtitle: "Johanna Hobel for SI",
    date: "DEC 2019",
    image: {
      url: image5,
      alt: "This is the alt image",
    },
    background: bg5,
  },
];

export type GalleryData = typeof data;

export default data;
