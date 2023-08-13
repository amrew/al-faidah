import { useEffect, useState } from "react";
import { EditorForm } from "~/components/editor-form.client";
import { TwoColumn } from "~/components/two-column";
import { useCompletion } from "~/components/utils";
import slugify from "slugify";
import { BiLoader } from "react-icons/bi";
import { TagsInput } from "react-tag-input-component";
import {
  json,
  redirect,
  type LoaderArgs,
  type ActionArgs,
} from "@remix-run/node";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { ArticleItem } from "~/components/article-item";
import invariant from "tiny-invariant";
import readingTime from "reading-time";
import { v4 as uuidv4 } from "uuid";

export const loader = async ({ request }: LoaderArgs) => {
  const { supabase, response } = createServerSupabase(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || (user && user.id !== process.env.USER_ID)) {
    throw new Response(null, {
      status: 404,
      statusText: "Halaman tidak ditemukan",
    });
  }

  let userProfile: {
    is_verified: boolean;
    role_id: number | null;
  } | null = { is_verified: false, role_id: null };

  if (user) {
    const { data } = await supabase
      .from("user_profiles")
      .select("is_verified, role_id")
      .eq("user_id", user.id)
      .single();

    userProfile = data;
  }

  const isVerified = userProfile?.is_verified;
  const roleId = userProfile?.role_id;

  if (!isVerified) {
    return redirect("/auth/verify", {
      headers: response.headers,
    });
  }

  const { data: publishers } = await supabase
    .from("publishers")
    .select("id, title, logo_url, slug");

  return json(
    {
      publishers,
      roleId,
    },
    { headers: response.headers }
  );
};

export const action = async ({ request }: ActionArgs) => {
  const { supabase, response } = createServerSupabase(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || (user && user.id !== process.env.USER_ID)) {
    throw new Response(null, {
      status: 404,
      statusText: "Halaman tidak ditemukan",
    });
  }

  const body = await request.formData();

  const title = body.get("title");
  const slug = body.get("slug");
  const description = body.get("description");
  const summary = body.get("summary");
  const tags = body.get("tags");
  const publisherId = body.get("publisher_id");
  const publisherSlug = body.get("publisher_slug");
  const link = body.get("link");
  const status = body.get("status");

  invariant(typeof title === "string", "Title is required");
  invariant(typeof description === "string", "Description is required");
  invariant(typeof summary === "string", "Summary is required");
  invariant(typeof tags === "string", "Tags is required");
  invariant(typeof publisherId === "string", "Publisher is required");
  invariant(typeof link === "string", "Link is required");
  invariant(typeof status === "string", "Status is required");
  invariant(typeof publisherSlug === "string", "Publisher slug is required");

  const tagArray = tags.split(",");
  const readStats = readingTime(description);

  const id = body.get("id") || uuidv4().split("-")[0].toUpperCase();

  const { error } = await supabase.from("contents").upsert({
    id,
    title,
    description,
    summary,
    terms: tagArray,
    publisher_id: publisherId,
    link,
    status,
    user_id: user?.id,
    slug,
    read_stats: {
      minutes: readStats.minutes,
      time: readStats.time,
      words: readStats.words,
    },
    type_id: 1,
  });

  if (error) {
    console.error(error);
  }

  return redirect(`/${publisherSlug}/${slug}`, { headers: response.headers });
};

export default function SettingsArticle() {
  const { publishers } = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const [editorShown, setEditor] = useState(false);

  const { state: titleState, fetch: fetchTitle } = useCompletion();
  const { state: tagState, fetch: fetchTag } = useCompletion();
  const { state: metaDescState, fetch: fetchMetaDesc } = useCompletion();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState<{ isEditted: boolean; value: string }>({
    isEditted: false,
    value: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [link, setLink] = useState("");

  const [status, setStatus] = useState("");
  const [publisherId, setPublisherId] = useState("");
  const selectedPublisher = publishers?.find((item) => item.id == publisherId);

  useEffect(() => {
    setEditor(true);
  }, []);

  useEffect(() => {
    if (title && !slug.isEditted) {
      setSlug({
        isEditted: false,
        value: slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g }),
      });
    } else if (!title) {
      setSlug({
        isEditted: false,
        value: "",
      });
    }
  }, [title]);

  useEffect(() => {
    if (tagState.type === "done") {
      try {
        const tags = JSON.parse(tagState.value);
        setTags((prev) => [...prev, ...tags]);
      } catch (err) {}
    }
  }, [tagState]);

  useEffect(() => {
    if (metaDescState.value) {
      setSummary(metaDescState.value);
    }
  }, [metaDescState]);

  return (
    <TwoColumn
      leftClassName="w-full"
      left={
        <Form method="post">
          <div className="flex flex-col gap-4 mt-4">
            <h1 className="text-xl font-bold">Buat Artikel</h1>
            <div className="form-control w-full gap-2 relative">
              <div className="flex flex-row justify-between">
                <span>Judul</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() =>
                    fetchTitle({
                      type: "title",
                      description: title,
                    })
                  }
                >
                  Saran
                </button>
              </div>
              <input
                name="title"
                type="text"
                placeholder="Judul..."
                className="input input-bordered w-full bg-white rounded-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {slug.value ? (
                <input
                  type="text"
                  name="slug"
                  className="input input-xs w-full"
                  value={slug.value}
                  onChange={(e) => {
                    setSlug({
                      isEditted: true,
                      value: e.target.value,
                    });
                  }}
                />
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <span>Description</span>
              </div>
              {editorShown ? (
                <>
                  <EditorForm
                    defaultValue={content}
                    placeholder="Tulis isi artikel disini..."
                    onChange={(content) => setContent(content)}
                    height="320"
                  />
                  <input type="hidden" name="description" value={content} />
                </>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between">
                <span>Summary</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() =>
                    fetchMetaDesc({
                      type: "meta-desc",
                      description: content,
                    })
                  }
                >
                  Saran
                </button>
              </div>
              <textarea
                name="summary"
                className="textarea textarea-bordered bg-white rounded-md"
                placeholder="Tulis meta description..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between">
                <span>Tags</span>
                <button
                  type="button"
                  className="btn btn-xs btn-ghost"
                  onClick={() =>
                    fetchTag({
                      type: "tag",
                      description: summary,
                    })
                  }
                >
                  Saran
                </button>
              </div>
              <TagsInput
                classNames={{
                  input: "px-2 py-1 border-base-300",
                  tag: "bg-red-100",
                }}
                value={tags}
                onChange={setTags}
                name="tag"
                placeHolder="Tags..."
              />
              <input type="hidden" name="tags" value={tags.join(",")} />
              <span className="text-xs">Tekan enter untuk menambah tag</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between">
                <span>Publisher</span>
              </div>
              <select
                name="publisher_id"
                className="select select-bordered w-full bg-white rounded-md"
                value={publisherId}
                onChange={(e) => {
                  setPublisherId(e.target.value);
                }}
                required
              >
                <option disabled value="">
                  Pilih Publisher
                </option>
                {publishers?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
              <input
                type="hidden"
                name="publisher_slug"
                value={selectedPublisher?.slug}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between">
                <span>Link Sumber</span>
              </div>
              <input
                name="link"
                type="text"
                placeholder="Link sumber..."
                className="input input-bordered w-full bg-white rounded-md"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between">
                <span>Status</span>
              </div>
              <select
                name="status"
                className="select select-bordered w-full bg-white rounded-md"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                required
              >
                <option disabled value="">
                  Status
                </option>
                <option value="publish">Publish</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="btn btn-accent"
                disabled={navigation.state !== "idle"}
              >
                Simpan
              </button>
            </div>
          </div>
        </Form>
      }
      right={
        <div className="flex flex-col">
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">Preview</h3>
            <ArticleItem
              title={title}
              publisher={{
                name: selectedPublisher?.title || "",
                logoUrl: selectedPublisher?.logo_url,
                slug: selectedPublisher?.slug,
              }}
              content={summary}
              terms={tags}
              detailUrl="/"
              readDuration={0}
              slug={slug.value}
              createdAt={new Date().toISOString()}
              link={link}
            />
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="font-bold text-lg">GPT</h3>
            {titleState.type === "fetching" ? (
              <BiLoader size={24} className="animate-spin" />
            ) : null}
          </div>
          {titleState.value ? (
            <div className="flex flex-col gap-2">
              <div className="prose bg-base-300 rounded-lg p-2">
                <div dangerouslySetInnerHTML={{ __html: titleState.value }} />
              </div>
              <div className="alert alert-warning rounded-lg">
                * Cek & validasi saran yang diberikan. Abaikan jika tidak
                sesuai.
              </div>
            </div>
          ) : (
            <div>-</div>
          )}
        </div>
      }
    />
  );
}
