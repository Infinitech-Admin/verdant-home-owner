"use client";
import PageLayout from "@/components/page-layout";
import AnnouncementsSection from "@/components/announcements-section";

export default function AnnouncementsPage() {
  return (
    <PageLayout
      title="Announcements"
      subtitle="Stay updated with the latest notices from Verdant Acres Villagers Association, Inc."
      image="/announcement_banner.png"
    >
      <AnnouncementsSection />
    </PageLayout>
  );
}
