import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/chat/ChatInterface";

export const metadata = {
  title: "Chat — Akira AI",
  description: "Converse com a Akira AI sobre investimentos, ações, FIIs e muito mais.",
};

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 pt-16 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
