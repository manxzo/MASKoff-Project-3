import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/template/index";
import DocsPage from "@/pages/template/docs";
import PricingPage from "@/pages/template/pricing";
import BlogPage from "@/pages/template/blog";
import AboutPage from "@/pages/template/about";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
