import Link from "next/link";
import { supabase } from "~/clients/supabaseClient";
import { BiTimeFive, BiPlay } from "react-icons/bi";

export default async function Home() {
  const { data: tags } = await supabase.from("tags").select();
  return (
    <main className="flex flex-col p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Kategori</h1>
        <div className="carousel gap-2">
          {tags?.map((tag) => (
            <div className="carousel-item" key={tag.id}>
              <Link href="">
                <div className="w-48 bg-secondary rounded-lg p-4">
                  <span className="text-white text-xl">{tag.name}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
