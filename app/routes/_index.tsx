import { redirect } from "react-router";

export function loader() {
  throw redirect("/BeiShiGaoZhong_4/words");
}

export default function PageHome() {
  return null;
}
