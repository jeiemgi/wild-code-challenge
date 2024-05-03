import Gallery from "./components/Gallery/Gallery.tsx";
import data from "@/js/data.ts";
import "@/App.css";

function App() {
  return <Gallery data={data} />;
}

export default App;
