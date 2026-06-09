import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/chat/ChatInterface";

export const metadata = {
  title: "Chat — Akira AI",
  description: "Converse com a Akira AI sobre investimentos, ações, FIIs e muito mais.",
};

export default function ChatPage() {
  return (
    <>
      <Navbar />
      <ChatInterface />
    </>
  );
}
