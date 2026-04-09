import AiChatFeature from "@/features/(student)/ai-chatbot/feature";

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">AI 학습 도우미</h1>
        <p className="text-zinc-400 text-sm">우측 하단의 채팅 버튼을 클릭하세요</p>
      </div>
      <AiChatFeature />
    </div>
  );
}
