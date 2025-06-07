"use client"

import { useChat } from "ai/react"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Play, X } from "lucide-react"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [conversationActive, setConversationActive] = useState(false)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleEndConversation = () => {
    // Reset the chat state
    messages.length = 0
    setConversationActive(false)
  }

  const handleStartConversation = () => {
    setConversationActive(true)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-center text-2xl">Hitesh.ai</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {!conversationActive && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-gray-500">Click the button below to start a new conversation</p>
              <Button onClick={handleStartConversation} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Conversation
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Send a message to start the conversation
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {message.parts.map((part, i) => {
                      if (part.type === "text") {
                        return (
                          <div key={i} className="whitespace-pre-wrap">
                            {part.text}
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading || !conversationActive}
            />
            <Button type="submit" size="icon" disabled={isLoading || !conversationActive}>
              <Send className="h-4 w-4" />
            </Button>
            {conversationActive && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleEndConversation}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                End Chat
              </Button>
            )}
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
