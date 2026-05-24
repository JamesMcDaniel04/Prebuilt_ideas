import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import MissingConfigBanner from "./MissingConfigBanner";

export default function Layout() {
  return (
    <div className="flex min-h-full flex-col">
      <MissingConfigBanner />
      <Header />
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
