import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 h-[calc(100vh-4rem)]">
        <ChatInterface />
      </div>
    </DashboardLayout>
  )
}
