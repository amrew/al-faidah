import { getRadio, getTracks } from "../service";
import { RadioList } from "../radio-list";
import Image from "next/image";
import { BiLink } from "react-icons/bi";

export default async function Detail({ params }: { params: { id: string } }) {
  const [radios, detail] = await Promise.all([
    getTracks(),
    getRadio(params.id),
  ]);
  const track = radios.find((item) => item.serial === params.id);
  return (
    <main className="flex flex-col p-4 gap-4">
      <div className="flex flex-row gap-2">
        <div className="flex flex-col sm:flex-row rounded-md overflow-hidden shadow-md">
          {detail && detail.imgnya && detail.imgnya !== "belum ada" ? (
            <Image
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
                <a href={"mailto:" + detail?.email} target="_blank">
                  <button className="btn btn-primary btn-sm">
                    <BiLink /> Email
                  </button>
                </a>
              ) : null}
              {detail?.telegram ? (
                <a href={detail?.telegram} target="_blank">
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
      <div>
        {track ? <RadioList items={[track]} filterShown={false} /> : null}
      </div>
    </main>
  );
}
