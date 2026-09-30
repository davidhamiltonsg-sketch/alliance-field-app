/**
 * About the authors (/about). Long versions live in the printed books.
 * An author whose bio still starts with "[[" is a placeholder and is not
 * rendered, so a placeholder never ships visibly.
 */
export interface Author {
  name: string;
  role: string;
  bio: string;
  url?: string;
}

/** Shown above the two bios: why the work is credible, and who it is not from. */
export const authorsIntro =
  "Neither of us is a therapist. The relational science comes from the research we cite. What we add is the system: Dami designs structures that hold up under load; David runs operations that hold up under pressure. These protocols were tested first in our own relationship, and as a biracial couple we know the outside pressures the Manual covers first-hand.";

export const authors: Author[] = [
  {
    name: "David Hamilton",
    role: "The operator",
    bio: "David is the operator: twenty years in banking and finance across Australia, Hong Kong and Singapore, including more than seventeen years with a major Australian and international bank, and now Director and APAC Regional CAO/COO for Global Payments & Trade at a global bank. Private banking taught him how trust is kept in high-stakes conversations; operations taught him that what you decide in advance is what happens under pressure. That thinking shaped THE ALLIANCE's scripts, return times and Weekly Reset.",
  },
  {
    name: "Dr Zhongming Shi (Dami)",
    role: "The system designer",
    bio: "Dami is the system designer: a trained architect and urban-systems researcher with a Doctor of Sciences from ETH Zurich (Singapore-ETH Centre, Future Cities Laboratory). His work maps how the parts of complex systems connect and designs them to hold up under load. That thinking shaped THE ALLIANCE's five layers and named circuits.",
  },
];

export const authorsClosing = "Dami and David are a couple, and share their home with two dogs, Troy and Bean.";

/** Authors ready to show: bio filled in (not a "[[...]]" placeholder). */
export function publishedAuthors(list: Author[] = authors): Author[] {
  return list.filter((a) => a.bio.trim() !== "" && !a.bio.trim().startsWith("[["));
}
