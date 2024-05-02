import Gallery from "./components/Gallery/Gallery.tsx";
import data from "@/js/data.ts";
import "@/App.css";

function App() {
  return (
    <>
      {/*<GalleryUI data={data} />*/}
      <Gallery data={data} />
    </>
  );
}

export default App;
