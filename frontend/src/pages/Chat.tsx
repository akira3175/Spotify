import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ArrowLeft, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Chatbox, Message } from "@/types/chat"
import { ChatboxService } from "@/services/ChatboxService"
import { ChatWebSocket } from "@/config/websocket"

// Thêm props cho Chat
interface ChatProps {
  userId?: string;
  popupMode?: boolean;
}

const Chat: React.FC<ChatProps> = ({ userId: propUserId, popupMode }) => {
  const params = useParams<{ userId: string }>()
  const userId = propUserId || params.userId;
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [chatbox, setChatbox] = useState<Chatbox | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const wsRef = useRef<ChatWebSocket | null>(null)
  const [messageText, setMessageText] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const AI_CHAT_USER_ID = 3;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Redirect if not authenticated
  useEffect(() => {
    console.log("Auth check:", { isAuthenticated })
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    console.log("user:", user)
    wsRef.current = new ChatWebSocket(Number(userId), (data) => {
      console.log("data:", data)
      if (data.user.username !== user?.username) {
        setMessages((prev) => [...prev, data])
      }
    })

    return () => {
      wsRef.current?.close()
    }
  }, [userId])

  // Load chatbox and messages
  useEffect(() => {
    console.log("Effect triggered:", { isAuthenticated, userId })
    const fetchChatboxData = async () => {
      console.log("Starting fetch with:", { userId, isAuthenticated })
      if (!userId) return

      try {
        setLoading(true)
        console.log("Loading set to true")

        // Fetch chatbox details
        const chatboxId = Number.parseInt(userId)
        const chatboxes = await ChatboxService.getChatboxes()
        console.log("chatboxes:", chatboxes)
        const currentChatbox = chatboxes.find((box: Chatbox) => box.id === chatboxId)

        if (currentChatbox) {
          setChatbox(currentChatbox)

          // Fetch messages for this chatbox
          const chatMessages = await ChatboxService.getMessages(chatboxId)
          setMessages(chatMessages)
        } else {
          setError("Chatbox not found")
        }
      } catch (err) {
        console.error("Error fetching chatbox data:", err)
        setError("Failed to load chat. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load chat data.",
          variant: "destructive",
        })
      } finally {
        console.log("Setting loading to false")
        setLoading(false)
      }
    }

    if (isAuthenticated && userId) {
      console.log("Fetching data...")
      fetchChatboxData()
    }
  }, [isAuthenticated, userId, toast])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !chatbox || !user) return

    try {
      // Create new message object
      const newMessage: Message = {
        id: 0, // Will be assigned by the server
        message: messageText,
        created_at: new Date().toISOString(),
        user: user,
      }

      // Optimistically update UI
      setMessages((prev) => [...prev, newMessage])
      setMessageText("")

      // Send message to server
      if (chatbox.id) {
        await ChatboxService.sendMessage(chatbox.id, newMessage)
      }

      // Show notification toast
      toast({
        title: "Message sent",
        description: "Your message has been sent.",
      })
    } catch (err) {
      console.error("Error sending message:", err)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Format time for messages
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </Layout>
    )
  }

  if (error || !chatbox) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <p className="text-red-500 mb-4">{error || "Chatbox not found"}</p>
          <Button onClick={() => navigate("/friends")}>Go Back</Button>
        </div>
      </Layout>
    )
  }

  // Find the other user in the chatbox (for direct messages)
  const otherMember = chatbox.members.find((member) => member.user.id !== user?.id)
  const isAIChat = otherMember && otherMember.user.id === AI_CHAT_USER_ID;

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        {!popupMode && (
          <div className="bg-zinc-900 p-4 flex items-center border-b border-zinc-800">
            <Button variant="ghost" size="icon" className="mr-2" onC lick={() => navigate("/friends")}>
              <ArrowLeft size={18} />
            </Button>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden relative" style={isAIChat ? { background: '#f59e42', display: 'flex', alignItems: 'center', justifyContent: 'center' } : { background: '#27272a' }}>
                {isAIChat ? (
                  <span style={{ fontSize: 28 }}>🤖</span>
                ) : otherMember ? (
                  otherMember.user.avatar ? (
                    <img
                      src={otherMember.user.avatar || "/placeholder.svg"}
                      alt={`${otherMember.user.username}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                      <User size={20} />
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                    <User size={20} />
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium" style={isAIChat ? { color: '#f59e42', fontWeight: 700 } : {}}>
                  {isAIChat ? 'Spotify AI' : (otherMember ? otherMember.user.last_name + " " + otherMember.user.first_name : "Group chat")}
                </p>
                <p className="text-xs text-zinc-400">
                  {isAIChat ? 'spotify_ai' : (otherMember ? otherMember.user.username : "Group chat")} •{" "}
                  {new Date(chatbox.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-zinc-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.user.id === user?.id;
              const isAI = message.user.id === AI_CHAT_USER_ID;

              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {!isCurrentUser && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={isAI ? { background: '#f59e42', display: 'flex', alignItems: 'center', justifyContent: 'center' } : { background: '#27272a' }}>
                      {isAI ? (
                        <span style={{ fontSize: 20 }}>🤖</span>
                      ) : message.user.avatar ? (
                        <img
                          src={message.user.avatar || "/placeholder.svg"}
                          alt={`${message.user.username}'s avatar`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                          <User size={16} />
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${isCurrentUser
                      ? "bg-green-500 text-black rounded-br-none"
                      : isAI
                        ? "bg-orange-100 text-orange-900 rounded-bl-none"
                        : "bg-zinc-800 text-white rounded-bl-none"
                      }`}
                    style={isAI ? { border: '1.5px solid #f59e42' } : {}}
                  >
                    {isAI && (
                      <p className="text-xs font-bold text-orange-500 mb-1">Spotify AI</p>
                    )}
                    <p>{message.message}</p>
                    <p className={`text-xs mt-1 ${isCurrentUser ? "text-black/70" : isAI ? "text-orange-400" : "text-zinc-400"}`}>
                      {formatMessageTime(message.created_at)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-zinc-900 p-4 border-t border-zinc-800">
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-black">
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Chat
