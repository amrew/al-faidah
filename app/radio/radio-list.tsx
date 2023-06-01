"use client";

import { useMemo, useState } from "react";
import { SortBy, TrackInfo } from "./entity";
import { RadioItem } from "./radio-item";
import MiniSearch, { SearchResult } from "minisearch";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { sortRadios } from "../utils";

type FilterOption = {
  name: string;
  keyword: string;
};

export type RadioListProps = {
  items: TrackInfo[];
  filterShown?: boolean;
  teachers?: FilterOption[];
  topics?: FilterOption[];
};

const search = (radios: TrackInfo[] | SearchResult[], keyword: string) => {
  const miniSearch = new MiniSearch({
    fields: ["name", "trackTitle"],
    storeFields: [
      "id",
      "serial",
      "name",
      "logoUrl",
      "listenerCount",
      "status",
      "trackTitle",
      "trackUrl",
    ],
    idField: "id",
  });

  miniSearch.addAll(radios);

  return miniSearch.search(keyword);
};

const defaultFilter = {
  keyword: "",
  sortBy: "default" as SortBy,
  teacher: "",
  topic: "",
};

export function RadioList(props: RadioListProps) {
  const { filterShown = true, teachers = [], topics = [] } = props;

  const [{ keyword, sortBy, teacher, topic }, setFilter] = useState<{
    keyword: string;
    sortBy: SortBy;
    teacher: string;
    topic: string;
  }>(defaultFilter);

  const setKeyword = (keyword: string) => {
    setFilter((prev) => ({ ...prev, keyword }));
  };
  const setSortBy = (sortBy: string) => {
    setFilter((prev) => {
      if (sortBy === "most") {
        return { ...prev, sortBy: "most" };
      } else if (sortBy === "less") {
        return { ...prev, sortBy: "less" };
      } else {
        return { ...prev, sortBy: "default" };
      }
    });
  };
  const setTeacher = (teacher: string) => {
    setFilter((prev) => ({ ...prev, teacher }));
  };
  const setTopic = (topic: string) => {
    setFilter((prev) => ({ ...prev, topic }));
  };

  const resetFilter = () => {
    setFilter(defaultFilter);
  };

  const results = useMemo(() => {
    let radios: TrackInfo[] | SearchResult[] = props.items;

    if (keyword) {
      radios = search(radios, keyword);
    }

    if (topic) {
      radios = search(radios, topic);
    }

    if (teacher) {
      radios = search(radios, teacher);
    }

    return sortRadios(radios as TrackInfo[], sortBy);
  }, [props.items, keyword, sortBy, teacher, topic]);

  return (
    <div>
      {filterShown ? (
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Cari radio / judul..."
            className="input input-bordered input-sm sm:input-md"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <select
            className="select select-bordered select-sm sm:select-md"
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="">Urutkan</option>
            <option value="most">Pendengar Terbanyak</option>
            <option value="less">Pendengar Tersedikit</option>
          </select>
          <select
            className="select select-bordered select-sm sm:select-md"
            onChange={(event) => setTeacher(event.target.value)}
          >
            <option value="">Semua Ustadz</option>
            {teachers.map((teacher) => (
              <option key={teacher.keyword} value={teacher.keyword}>
                {teacher.name}
              </option>
            ))}
          </select>
          <select
            className="select select-bordered select-sm sm:select-md"
            onChange={(event) => setTopic(event.target.value)}
          >
            <option value="">Semua Topic</option>
            {topics.map((item) => (
              <option key={item.keyword} value={item.keyword}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {results.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center items-center p-8 bg-base-100 gap-2">
          <HiOutlineDocumentSearch size={48} />
          Radio tidak ditemukan
          <button className="btn btn-primary btn-sm" onClick={resetFilter}>
            Kembali
          </button>
        </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {results?.map((item) => (
          <RadioItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
