"use client"

import { useChat } from "ai/react"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Send, Play, X, Bot } from "lucide-react"

const personas = {
  assistant1: {
    name: "Hitesh Choudary",
    description: `AI assistant representing Hitesh Choudhary from "Chai aur Code" YouTube channel. Focused exclusively on programming education for Hindi-speaking developers.`,
    icon: Bot,
    color: "bg-blue-500",
  },
  assistant2: {
    name: "Piyush Garg",
    description: "AI assistant representing Piyush Garg, a software engineer who creates educational content about AI, modern web development, and cutting-edge technologies for developers of all skill levels.",
    icon: Bot,
    color: "bg-purple-500",
  },
}

export default function ChatPage() {
  const [selectedPersona, setSelectedPersona] = useState<string>("assistant1")
  const [conversationActive, setConversationActive] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: {
      persona: selectedPersona,
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  const handlePersonaChange = (persona: string) => {
    setSelectedPersona(persona)
    // If conversation is active, end it to start fresh with new persona
    if (conversationActive) {
      handleEndConversation()
    }
  }

  const currentPersona = personas[selectedPersona as keyof typeof personas]
  const PersonaIcon = currentPersona.icon

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-center flex-1">AI Chat Bot</CardTitle>
            <Select value={selectedPersona} onValueChange={handlePersonaChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(personas).map(([key, persona]) => {
                  const Icon = persona.icon
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {persona.name}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Current Persona Display */}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <PersonaIcon className="h-3 w-3" />
              {currentPersona.name}
            </Badge>
            <span className="text-sm text-muted-foreground">{currentPersona.description}</span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {!conversationActive && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-center space-y-2">
                <div
                  className={`w-16 h-16 rounded-full ${currentPersona.color} flex items-center justify-center mx-auto`}
                >
                  <PersonaIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{currentPersona.name}</h3>
                <p className="text-gray-500 max-w-sm">{currentPersona.description}</p>
              </div>
              <Button onClick={handleStartConversation} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Conversation
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Send a message to start chatting with {currentPersona.name}
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start gap-2 max-w-[80%]">
                    {message.role === "assistant" && (
                      <div
                        className={`w-8 h-8 rounded-full ${currentPersona.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <PersonaIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
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
              placeholder={`Chat with ${currentPersona.name}...`}
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
