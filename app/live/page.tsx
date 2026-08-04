import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side fetching
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Performer {
  model_id: number;
  name: string;
  room_status: string;
  sample_image: string;
  chat_link: string;
  categories: Array<{ name: string; url: string }>;
}

async function getLivePerformers(): Promise<Performer[]> {
  const { data, error } = await supabase
    .from('f4f_performers')
    .select('*')
    .eq('is_online', true)
    .order('last_updated', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching performers:', error.message);
    return [];
  }

  return data || [];
}

export default async function LiveCamPage() {
  const performers = await getLivePerformers();
  const trackingCode = 'f1kij'; // Your tracking code from Erica

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Live Performers</h1>
        <p className="text-zinc-400 mb-8">
          Showing active streams updated in real time via Pulse8 engine.
        </p>

        {performers.length === 0 ? (
          <p className="text-zinc-500">No models currently online or syncing in progress...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {performers.map((model) => {
              // Append your tracking code cleanly to the chat link
              const affiliateLink = `${model.chat_link}?mp=${trackingCode}`;

              return (
                <div 
                  key={model.model_id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition duration-200 flex flex-col"
                >
                  <div className="relative aspect-[3/4] bg-zinc-950">
                    {model.sample_image ? (
                      <img 
                        src={model.sample_image} 
                        alt={model.name}
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
                        No Preview
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {model.room_status || 'Live'}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-zinc-100 truncate">{model.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {model.categories?.slice(0, 2).map((cat, idx) => (
                          <span key={idx} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded">
                            {cat.name || cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <a 
                      href={affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 block w-full bg-white text-black text-center font-medium py-2.5 rounded-lg hover:bg-zinc-200 transition duration-150"
                    >
                      Enter Room
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
