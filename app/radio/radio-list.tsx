"use client";

import { useMemo, useState } from "react";
import { TrackInfo } from "./entity";
import { RadioItem } from "./radio-item";
import MiniSearch, { SearchResult } from "minisearch";
import { useAudioContext } from "../audio-context";

export type RadioListProps = {
  items: TrackInfo[];
};

const teachers = [
  {
    name: "Abu Hamzah Yusuf",
    keyword: "hamzah yusuf",
  },
  {
    name: "Muhammad bin Umar Assewed",
    keyword: "umar",
  },
  {
    name: "Muhammad Rijal",
    keyword: "rijal",
  },
  {
    name: "Abu Hamzah Shodiqun",
    keyword: "shodiqun",
  },
  {
    name: "Saiful Bahri",
    keyword: "saiful bahri",
  },
  {
    name: "Afifuddin As-Sidawi",
    keyword: "afifuddin",
  },
  {
    name: "Usamah bin Faishal Mahri",
    keyword: "usamah mahri",
  },
  {
    name: "Abu Nasim Mukhtar",
    keyword: "nasim mukhtar",
  },
];

const sortRadios = (
  radios: TrackInfo[] | SearchResult[],
  sortBy: string | undefined
) => {
  if (sortBy === "most") {
    return [...radios].sort((a, b) =>
      Number(a.pendengar) > Number(b.pendengar) ? -1 : 1
    );
  } else if (sortBy === "less") {
    return [...radios].sort((a, b) =>
      Number(a.pendengar) < Number(b.pendengar) ? -1 : 1
    );
  } else {
    return radios;
  }
};

const search = (radios: TrackInfo[] | SearchResult[], keyword: string) => {
  const miniSearch = new MiniSearch({
    fields: ["nama", "judul"],
    storeFields: [
      "uid_rad",
      "nama",
      "judul",
      "logo",
      "pendengar",
      "status",
      "url",
    ],
    idField: "uid_rad",
  });

  miniSearch.addAll(radios);

  return miniSearch.search(keyword);
};

export function RadioList(props: RadioListProps) {
  const { track, play, stop, isLoading } = useAudioContext();

  const [{ keyword, sortBy, teacher }, setFilter] = useState<{
    keyword: string;
    sortBy: string;
    teacher: string;
  }>({
    keyword: "",
    sortBy: "",
    teacher: "",
  });

  const setKeyword = (keyword: string) => {
    setFilter((prev) => ({ ...prev, keyword }));
  };
  const setSortBy = (sortBy: string) => {
    setFilter((prev) => ({ ...prev, sortBy }));
  };
  const setTeacher = (teacher: string) => {
    setFilter((prev) => ({ ...prev, teacher }));
  };

  const results = useMemo(() => {
    let radios: TrackInfo[] | SearchResult[] = props.items;

    if (keyword) {
      radios = search(radios, keyword);
    }

    if (teacher) {
      radios = search(radios, teacher);
    }

    return sortRadios(radios, sortBy);
  }, [props.items, keyword, sortBy, teacher]);

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
        <input
          type="text"
          placeholder="Cari..."
          className="input input-bordered"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <select
          className="select"
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option disabled selected>
            Urutkan
          </option>
          <option value="">Default</option>
          <option value="most">Pendengar Terbanyak</option>
          <option value="less">Pendengar Tersedikit</option>
        </select>
        <select
          className="select"
          onChange={(event) => setTeacher(event.target.value)}
        >
          <option disabled selected>
            Pilih Ustadz
          </option>
          <option value="">Semua</option>
          {teachers.map((teacher) => (
            <option key={teacher.keyword} value={teacher.keyword}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {results?.map((item) => (
          <RadioItem
            key={item.uid_rad}
            isActive={track?.url === item.url}
            isLoading={isLoading}
            item={{
              id: item.uid_rad,
              logoUrl: item.logo,
              name: item.nama,
              trackTitle: item.judul,
              listenerCount: Number(item.pendengar),
              status: item.status,
            }}
            onPlay={() =>
              play({
                name: item.nama,
                url: item.url,
                trackTitle: item.judul,
                logoUrl: item.logo,
              })
            }
            onStop={() => stop()}
          />
        ))}
      </div>
    </div>
  );
}
