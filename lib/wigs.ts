export type WigCategory = {
  id: string;
  parentId?: string;
  name: string;
  sortOrder?: number;
  image?: string | null;
  href?: string | null;
};

export type WigOption = {
  id: string;
  name: string;
  imageSrc: string;
  category?: string;
  categoryIds?: number[];
  price?: string | null;
  special?: string | null;
  href?: string | null;
  isFallbackImage?: boolean;
};

export const fallbackCategories: WigCategory[] = [
  { id: "156", name: "Парики (Wigs)" },
  { id: "160", name: "Skin Top" },
  { id: "162", name: "Lace Front" },
  { id: "161", name: "Lace Top" },
  { id: "157", name: "Шиньоны (Hairpieces)" },
  { id: "158", name: "Хвосты (Ponytails)" },
  { id: "159", name: "Пряди (Wefts)" }
];

export const fallbackWigOptions: WigOption[] = [
  {
    id: "rusye-1",
    name: "Русый 01",
    imageSrc: "/wigs/rusye/rusye-1.png",
    category: "156"
  },
  {
    id: "rusye-2",
    name: "Русый 02",
    imageSrc: "/wigs/rusye/rusye-2.png",
    category: "156"
  },
  {
    id: "rusye-3",
    name: "Русый 03",
    imageSrc: "/wigs/rusye/rusye-3.png",
    category: "156"
  },
  {
    id: "blond-1",
    name: "Блонд 01",
    imageSrc: "/wigs/blond/blond-1.png",
    category: "156"
  },
  {
    id: "blond-2",
    name: "Блонд 02",
    imageSrc: "/wigs/blond/blond-2.png",
    category: "156"
  },
  {
    id: "blond-3",
    name: "Блонд 03",
    imageSrc: "/wigs/blond/blond-3.png",
    category: "156"
  },
  {
    id: "blond-4",
    name: "Блонд 04",
    imageSrc: "/wigs/blond/blond-4.png",
    category: "156"
  },
  {
    id: "ruzhie-1",
    name: "Рыжий 01",
    imageSrc: "/wigs/ruzhie/ruzhie-1.png",
    category: "156"
  },
  {
    id: "brunet-1",
    name: "Брюнет 01",
    imageSrc: "/wigs/brunet/brunet-1.png",
    category: "156"
  },
  {
    id: "wig-2",
    name: "Брюнет 02",
    imageSrc: "/wigs/brunet/brunet-2.png",
    category: "156"
  }
];

export function getWigById(id: string, optionsList: WigOption[] = fallbackWigOptions) {
  return optionsList.find((wig) => wig.id === id) ?? null;
}