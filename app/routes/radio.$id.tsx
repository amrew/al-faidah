import { getRadio, getTracks } from "~/components/radio-service";
import { BiLink } from "react-icons/bi";
import { RadioList } from "~/components/radio-list";
import { type LoaderArgs, json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.id;

  const radios = await getTracks();
  const track = radios.find((item) => item.alias === id);
  const detail = await (track
    ? getRadio(track.serial)
    : id
    ? getRadio(id)
    : undefined);

  return json({
    id,
    radios,
    track,
    detail,
  });
};

export const meta: V2_MetaFunction = ({ data }) => {
  const { track, detail } = data;
  return [
    { title: `${track.name} - Radio Islam Indonesia` },
    {
      name: "description",
      content: `${track.name} - ${detail?.alamat_rad}`,
    },
  ];
};

export default function RadioDetail() {
  const { id, radios, track, detail } = useLoaderData<typeof loader>();

  return (
    <main className="flex flex-col p-4 gap-4">
      <RadioList
        items={track ? [track] : radios.filter((item) => item.serial === id)}
      />
      <div className="flex flex-row gap-2">
        <div className="flex flex-col sm:flex-row rounded-md overflow-hidden shadow-md">
          {detail && detail.imgnya && detail.imgnya !== "belum ada" ? (
            <img
              src={detail.imgnya}
              width={400}
              height={300}
              alt={detail?.nama_rad}
              className="w-full sm:max-w-md"
            />
          ) : null}
          <div className="bg-base-100 p-4 w-full sm:w-auto sm:max-w-lg">
            <div>
              <h1 className="text-xl font-semibold">Alamat</h1>
              <p>{detail?.alamat_rad}</p>
            </div>
            <div className="mt-2">
              <h1 className="text-lg font-semibold">Zona</h1>
              <p>
                {detail?.prop} | {detail?.zona_radio}
              </p>
            </div>
            <div className="mt-2">
              <h1 className="text-lg font-semibold">Pembimbing</h1>
              <p>al-Ustadz {detail?.pembimbing}</p>
            </div>
            <div className="mt-2 flex flex-row gap-2">
              {detail?.email ? (
                <a
                  href={"mailto:" + detail?.email}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="btn btn-primary btn-sm">
                    <BiLink /> Email
                  </button>
                </a>
              ) : null}
              {detail?.telegram ? (
                <a href={detail?.telegram} target="_blank" rel="noreferrer">
                  <button className="btn btn-primary btn-sm">
                    <BiLink /> Telegram
                  </button>
                </a>
              ) : null}
              {detail?.web ? (
                <a
                  href={
                    !detail?.web.startsWith("http")
                      ? `https://${detail.web}`
                      : detail.web
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="btn btn-primary btn-sm">
                    <BiLink /> Web
                  </button>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
