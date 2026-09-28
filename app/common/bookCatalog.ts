export type BookCatalogKey =
  | "xx"
  | "cz"
  | "gz"
  | "cet4"
  | "cet6"
  | "tem4"
  | "tem8"
  | "ky"
  | "ielts"
  | "toefl"
  | "gre"
  | "sat"
  | "gmat"
  | "sw";

type BookCatalogItem = {
  key: BookCatalogKey;
  label: string;
  bookIds: readonly number[];
};

export const BOOK_CATALOG: readonly BookCatalogItem[] = [
  {
    key: "xx",
    label: "小学",
    bookIds: [37, 38, 39, 40, 41, 42, 43, 44],
  },
  {
    key: "cz",
    label: "初中",
    bookIds: [33, 35, 45, 46, 47, 49, 50, 51, 52, 53, 54, 55, 67],
  },
  {
    key: "gz",
    label: "高中",
    bookIds: [
      34, 36, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 68, 71, 72, 73, 74,
      75, 76, 77, 78, 79, 80, 81,
    ],
  },
  { key: "cet4", label: "四级", bookIds: [1, 6, 11, 14, 18] },
  { key: "cet6", label: "六级", bookIds: [2, 7, 12, 15] },
  { key: "tem4", label: "专四", bookIds: [4, 9, 17, 19] },
  { key: "tem8", label: "专八", bookIds: [5, 10, 20] },
  { key: "ky", label: "考研", bookIds: [3, 8, 13, 16] },
  { key: "ielts", label: "雅思", bookIds: [21, 26, 31] },
  { key: "toefl", label: "托福", bookIds: [22, 27] },
  { key: "gre", label: "GRE", bookIds: [23, 28] },
  { key: "sat", label: "SAT", bookIds: [24, 29] },
  { key: "gmat", label: "GMAT", bookIds: [25, 30, 32] },
  { key: "sw", label: "商务", bookIds: [69, 70] },
];

export function getBookCatalogLabel(bookId: number) {
  return (
    BOOK_CATALOG.find(({ bookIds }) => bookIds.includes(bookId))?.label ??
    "其他"
  );
}
