import { json, type LoaderArgs } from "@remix-run/node";
import { MeiliSearch } from "meilisearch";

export async function loader({ request }: LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  const client = new MeiliSearch({
    host: process.env.MEILI_ENDPOINT!,
    apiKey: process.env.MEILI_MASTER_KEY!,
  });

  // await client
  //   .index("contents")
  //   .updateRankingRules([
  //     "proximity",
  //     "words",
  //     "typo",
  //     "attribute",
  //     "exactness",
  //     "sort",
  //   ]);

  const result = await client.index("contents").search(q);
  return json(result);
}
