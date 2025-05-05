import { Message } from "@/types/chat";
  
export class ChatWebSocket {
    private socket: WebSocket;
    private chatboxId: number;
    private baseUrl: string;
    private onMessageCallback?: (data: Message) => void;
  
    constructor(chatboxId: number, onMessage?: (data: Message) => void) {
      this.chatboxId = chatboxId;
      this.onMessageCallback = onMessage;
      this.baseUrl = import.meta.env.VITE_API_URL;
      const wsUrl = `${this.baseUrl}ws/chat/${chatboxId}/`; 
      this.socket = new WebSocket(wsUrl);
  
      this.socket.onopen = () => {
        console.log("WebSocket connected");
      };
  
      this.socket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data) as Message;
        if (this.onMessageCallback) {
          this.onMessageCallback(data);
        }
      };
  
      this.socket.onclose = () => {
        console.log("WebSocket disconnected");
      };
  
      this.socket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    }
  
    sendMessage(msg: string) {
      const payload = { message: msg };
      this.socket.send(JSON.stringify(payload));
    }
  
    close() {
      this.socket.close();
    }
}
  