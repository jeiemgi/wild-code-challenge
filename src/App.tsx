import "@/App.css";
import Gallery from "./components/Gallery";
import Layout from "@/components/Layout.tsx";
import data from "@/js/data.ts";

function App() {
  return (
    <Layout>
      <Gallery id={"gallery-home"} data={data} />
    </Layout>
  );
}

export default App;
