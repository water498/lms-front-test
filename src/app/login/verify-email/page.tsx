import { redirect } from "next/navigation";

// 이메일 인증은 회원가입 플로우에 통합 (/login/register)
export default function Page() {
  redirect("/login/register");
}
