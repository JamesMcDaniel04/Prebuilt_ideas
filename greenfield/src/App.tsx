import { Routes, Route } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import MarketingLayout from "@/components/layout/MarketingLayout";
import LandingPage from "@/pages/LandingPage";
import CareerPage from "@/pages/CareerPage";
import CareerTrackPage from "@/pages/CareerTrackPage";
import CareerProjectPage from "@/pages/CareerProjectPage";
import AuthPage from "@/pages/AuthPage";
import PricingPage from "@/pages/PricingPage";
import NotFoundPage from "@/pages/NotFoundPage";
import DevBypassPage from "@/pages/DevBypassPage";
import PortfolioSettingsPage from "@/pages/PortfolioSettingsPage";
import PublicPortfolioPage from "@/pages/PublicPortfolioPage";

export default function App() {
  return (
    <Routes>
      {/* Developer-only entrance — bypasses the payment gateway. Standalone shell. */}
      <Route path="/masteroreo911" element={<DevBypassPage />} />

      {/* Public marketing shell — top nav + footer, no sidebar.
       * Auth + pricing live here so visitors never see the platform chrome
       * before they're signed in (and ideally paying). */}
      <Route element={<MarketingLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        {/* Public verified portfolio — no auth required. */}
        <Route path="/portfolio/:username" element={<PublicPortfolioPage />} />
      </Route>

      {/* App shell — sidebar + main. Members only. */}
      <Route element={<Layout />}>
        <Route path="/career" element={<CareerPage />} />
        <Route path="/career/:trackSlug" element={<CareerTrackPage />} />
        <Route path="/career/:trackSlug/:projectSlug" element={<CareerProjectPage />} />
        <Route path="/settings/portfolio" element={<PortfolioSettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
