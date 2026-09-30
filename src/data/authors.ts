/**
 * About the authors (/about). Fill in `role`, `bio` and optionally `url`.
 * An author whose bio still starts with "[[" is a placeholder and is not
 * rendered, so the placeholder never ships visibly.
 */
export interface Author {
  name: string;
  role: string;
  bio: string;
  url?: string;
}

export const authors: Author[] = [
  { name: "David Hamilton", role: "", bio: "[[BIO_DAVID]]" },
  { name: "Dr Zhongming Shi", role: "", bio: "[[BIO_SHI]]" },
];

/** Authors ready to show: bio filled in (not a "[[...]]" placeholder). */
export function publishedAuthors(list: Author[] = authors): Author[] {
  return list.filter((a) => a.bio.trim() !== "" && !a.bio.trim().startsWith("[["));
}
