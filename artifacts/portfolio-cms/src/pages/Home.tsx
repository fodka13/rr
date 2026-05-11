import { useEffect } from "react";
import { useGetStats, useTrackVisitor, useListFeaturedLogos, useListFeaturedProjects, useListFeaturedComments, useListWorks, useListBlogs } from "@workspace/api-client-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { FeaturedLogosSection } from "@/components/sections/FeaturedLogosSection";
import { FeaturedProjectsSection } from "@/components/sections/FeaturedProjectsSection";
import { RecentWorksSection } from "@/components/sections/RecentWorksSection";
import { RecentBlogsSection } from "@/components/sections/RecentBlogsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";

export default function Home() {
  const visitorMutation = useTrackVisitor();

  useEffect(() => {
    visitorMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: stats } = useGetStats();
  const { data: logosData } = useListFeaturedLogos();
  const { data: featuredProjectsData } = useListFeaturedProjects();
  const { data: commentsData } = useListFeaturedComments();
  const { data: recentWorks } = useListWorks({ limit: 6 });
  const { data: recentBlogs } = useListBlogs({ limit: 3, published: true });

  return (
    <div className="w-full" dir="rtl">
      <HeroSection />

      <StatsSection
        visitorCount={stats?.visitorCount || 0}
        worksCount={stats?.worksCount || 0}
        topClientsCount={stats?.topClientsCount || 0}
        partnersCount={stats?.partnersCount || 0}
      />

      <FeaturedLogosSection logos={logosData || []} />

      <FeaturedProjectsSection projects={featuredProjectsData || []} />

      <RecentWorksSection works={recentWorks?.works || []} />

      <RecentBlogsSection blogs={recentBlogs?.blogs || []} />

      <TestimonialsSection comments={commentsData || []} />
    </div>
  );
}
