import { TrackInfo } from "./radio-entity";
import { RadioItem } from "./radio-item";
import { APP_URL, ThemeName, themes } from "./utils";
import { useState } from "react";
import { BiCheck } from "react-icons/bi";

function generateIFrameTemplate(src: string) {
  return `<iframe 
  src="${src}" 
  frameborder="0" 
  height="220" 
  scrolling="no"></iframe>`;
}

export function ModalEmbed({ track, id }: { track: TrackInfo; id: string }) {
  const [theme, setTheme] = useState<ThemeName>("cupcake");
  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box bg-white flex flex-col gap-4">
          <h3 className="text-lg font-bold">Preview</h3>
          <div className="flex flex-row gap-1 carousel">
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
          <div data-theme={theme}>
            <RadioItem item={track} embed />
          </div>
          <p>Salin kode berikut untuk pasang di website atau blog kamu</p>
          <div className="mockup-code">
            <pre>
              <code>
                {generateIFrameTemplate(
                  `${APP_URL}/embed/radio/${track.serial}?theme=${theme}`
                )}
              </code>
            </pre>
          </div>
          <div className="modal-action">
            <label className="btn btn-outline btn-sm" htmlFor={id}>
              Tutup
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
