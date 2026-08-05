import { notFound } from 'next/navigation';
import ErikaLustBanner from '@/components/ErikaLustBanner';
import LiveJasminVideoBanner from '@/components/LiveJasminVideoBanner';

interface GuidePageProps {
  params: {
    slug: string;
  };
}

// First batch of high-intent programmatic SEO pages
const GUIDES_DATA: Record<string, {
  title: string;
  subtitle: string;
  metaDescription: string;
  keyword: string;
  intro: string;
  features: string[];
  recommendedPartner: 'erikalust' | 'livejasmin' | 'both';
}> = {
  'livejasmin-alternatives': {
    title: 'Best LiveJasmin Alternatives for High-Definition Streaming',
    subtitle: 'Compare top-tier live cam platforms featuring uncompressed HD streams, verified performers, and active member perks.',
    metaDescription: 'Looking for the best LiveJasmin alternatives? Discover top-rated live streaming platforms with HD video quality, verified performers, and exclusive member benefits.',
    keyword: 'LiveJasmin alternatives',
    intro: 'If you are exploring platforms similar to LiveJasmin for high-definition live streaming, finding sites with reliable feeds, verified talent, and a smooth user experience is essential. Pulse8 curates top-performing networks to give you uncompromised access.',
    features: [
      'Uncompressed high-definition video feeds',
      'Verified independent performers and studios',
      'Interactive features and real-time private connections',
      'Secure, discreet billing and modern UI'
    ],
    recommendedPartner: 'livejasmin'
  },
  'erikalust-alternatives': {
    title: 'Best Sites Like ErikaLust for Ethical & Cinematic Adult Content',
    subtitle: 'Explore premium streaming platforms dedicated to high-definition, award-winning, and ethically produced adult cinema.',
    metaDescription: 'Searching for sites like ErikaLust? Discover top platforms offering high-end, ethical, and cinematic adult movies with exclusive discount offers.',
    keyword: 'ErikaLust alternatives',
    intro: 'For viewers who prioritize cinematic production quality, storytelling, and ethical production standards, finding alternatives to ErikaLust opens up a curated world of high-end adult entertainment.',
    features: [
      'Award-winning cinematic productions',
      'Ethically driven studios and diverse directors',
      'High-definition streaming across all devices',
      'Exclusive member discounts and bundle savings'
    ],
    recommendedPartner: 'erikalust'
  },
  'best-hd-cam-platforms': {
    title: 'Top HD Live Cam Platforms & Streaming Sites in 2026',
    subtitle: 'A comprehensive look at the highest-rated live streaming destinations optimized for speed, clarity, and user privacy.',
    metaDescription: 'Compare the best HD live cam platforms of 2026. Review streaming quality, performer variety, and platform features for an optimal viewing experience.',
    keyword: 'HD live cam platforms',
    intro: 'Streaming technology has evolved past lagging connections and low-resolution previews. Modern high-definition live platforms deliver crystal-clear video feeds with zero latency.',
    features: [
      'Ultra-low latency live streams',
      'Global performer catalog across multiple categories',
      'Mobile-optimized responsive interfaces',
      'Advanced filtering and real-time search discovery'
    ],
    recommendedPartner: 'both'
  }
};

// Generate static routes at build time for instant Google crawling
export async function generateStaticParams() {
  return Object.keys(GUIDES_DATA).map((slug) => ({
    slug,
  }));
}

// Dynamic SEO Metadata generation
export async function generateMetadata({ params }: GuidePageProps) {
  const guide = GUIDES_DATA[params.slug];
  if (!guide) return { title: 'Page Not Found' };

  return {
    title: `${guide.title} | Pulse8`,
    description: guide.metaDescription,
    openGraph: {
      title: guide.title,
      description: guide.metaDescription,
      type: 'article',
    },
  };
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = GUIDES_DATA[params.slug];

  if (!guide) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumb / Category Tag */}
        <div className="flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-wider">
          <span>Pulse8 Research</span>
          <span>/</span>
          <span>{guide.keyword}</span>
        </div>

        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            {guide.title}
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
            {guide.subtitle}
          </p>
        </div>

        {/* Intro & Core Content */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
          <p className="text-zinc-300 leading-relaxed text-base md:text-lg">
            {guide.intro}
          </p>

          <h3 className="text-xl font-bold text-white tracking-tight">What to Look For</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guide.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                <span className="text-red-500 font-bold">&#10003;</span>
                <span className="text-zinc-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conditional Affiliate Banners based on page target */}
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-bold text-white tracking-tight">Featured Verified Partners</h3>
          
          {(guide.recommendedPartner === 'livejasmin' || guide.recommendedPartner === 'both') && (
            <LiveJasminVideoBanner />
          )}

          {(guide.recommendedPartner === 'erikalust' || guide.recommendedPartner === 'both') && (
            <ErikaLustBanner />
          )}
        </div>

      </div>
    </main>
  );
}
