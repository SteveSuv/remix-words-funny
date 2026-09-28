import { href, redirect, type LoaderFunctionArgs } from "react-router";
import { getUserIdFromRequest } from "~/.server/common/auth";
import { getStarBookSlugs } from "~/.server/router/loader/getStarBooks";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = getUserIdFromRequest(request);
  const [firstStarBookSlug] = userId ? await getStarBookSlugs(userId) : [];
  const DEFAULT_BOOK_SLUG = "BeiShiGaoZhong_4";
  const bookSlug = firstStarBookSlug ?? DEFAULT_BOOK_SLUG;

  throw redirect(href("/:bookSlug/words", { bookSlug }));
}

export default function PageHome() {
  return null;
}
