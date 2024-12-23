import { redirect } from "react-router";

export const loader = async () => {
  return redirect(`/BeiShiGaoZhong_4/words`);
};

export default function PageHome() {
  return null;
}
