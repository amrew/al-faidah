import { getTracks } from "~/components/radio-service";
import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { type ThemeName, themes, APP_URL } from "~/components/utils";
import { useState } from "react";
import { BiCheck } from "react-icons/bi";
import { RadioList } from "~/components/radio-list";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Settings Embed - Al Faidah" }];
};

export const loader = async () => {
  const radios = await getTracks();
  return json({
    radios,
  });
};

function generateIFrameTemplate(
  src: string,
  dimensions: { width?: string; height?: string }
) {
  return `<iframe 
  src="${src}"
  scrolling="no"
  frameborder="0" 
  ${dimensions.width ? `width="${dimensions.width}"` : ""}
  ${dimensions.height ? `height="${dimensions.height}"` : ""}></iframe>`;
}

export default function Radio() {
  const { radios } = useLoaderData<typeof loader>();
  const [theme, setTheme] = useState<ThemeName>("cupcake");
  const [tab, setTab] = useState<"preview" | "code">("preview");

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  // get radio ids from checkedItems that are true
  const radioIds = Object.keys(checkedItems).filter((key) => {
    return checkedItems[key];
  });

  return (
    <div className="h-full">
      <div className="px-4 md:px-8 pt-4">
        <h3 className="text-lg font-bold text-neutral mb-4">Theme</h3>
        <div className="carousel gap-2">
          {themes.map((item) => (
            <button
              key={item.name}
              className={`btn btn-ghost btn-xs text-white carousel-item ${item.color}`}
              onClick={() => setTheme(item.name)}
            >
              {item.name === "dracula" ? "dark" : item.name}
              {item.name === theme ? <BiCheck size={20} /> : null}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-row p-4 md:p-8 gap-8 h-5/6">
        <div className="w-1/3 flex flex-col gap-4 overflow-y-auto h-full">
          {radios
            .sort((a, b) => {
              return a.name.localeCompare(b.name);
            })
            .map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex flex-row gap-3 items-center border-base-300 rounded-md bg-base-100 shadow-sm border p-2"
                >
                  <img
                    src={item.logoUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded-md"
                    width={80}
                    height={80}
                  />
                  <h2
                    className={`flex-1 line-clamp-1 font-semibold text-md text-base-content`}
                  >
                    {item.name}
                  </h2>
                  <input
                    type="checkbox"
                    name={item.alias}
                    checked={checkedItems[item.alias]}
                    className="checkbox"
                    onChange={(event) => {
                      setCheckedItems((prev) => ({
                        ...prev,
                        [event.target.name]: event.target.checked,
                      }));
                    }}
                  />
                </div>
              );
            })}
        </div>
        <div className="flex flex-col gap-2">
          <button
            className={`btn btn-sm ${tab === "preview" ? "btn-accent" : ""}`}
            onClick={() => setTab("preview")}
          >
            Preview
          </button>
          <button
            className={`btn btn-sm ${tab === "code" ? "btn-accent" : ""}`}
            onClick={() => setTab("code")}
          >
            Kode
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {tab === "preview" ? (
            <div className="mockup-phone">
              <div className="camera"></div>
              <div className="display">
                <div
                  className="artboard artboard-demo phone-1 overflow-y-auto justify-start pt-8"
                  data-theme={theme}
                >
                  <div className="flex flex-col gap-2 mx-2">
                    <RadioList
                      items={radios.filter((item) => {
                        return checkedItems[item.alias];
                      })}
                      embed
                      disabledRefreshInterval
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {tab === "code" ? (
            <div className="mockup-code w-80">
              <pre>
                <code>
                  {generateIFrameTemplate(
                    `${APP_URL}/e/radios?theme=${theme}&ids=${radioIds.join(
                      "+"
                    )}`,
                    { width: "320", height: "480" }
                  )}
                </code>
              </pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
