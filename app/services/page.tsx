"use client";

import PageLayout from "@/components/page-layout";
import ServicesSection from "@/components/services-section";

export default function ServicesPage() {
  return (
    <PageLayout
      title="Association Services"
      subtitle="Explore all the services we offer to Verdant Acres residents"
      image="/announcement_banner.png"
    >
      <ServicesSection />
    </PageLayout>
  );
}
