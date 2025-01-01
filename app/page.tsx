"use client";
import { useChat } from "ai/react";
import { Bot, Loader2, Send, User2 } from "lucide-react";
import Image from "next/image";
import Markdown from "./component/markdown";
import { useEffect, useRef } from "react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: "api/llm-response",
    });

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // Adjust the textarea height based on the content
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on content
    }
  }, [input]);

  return (
    <main className="relative flex min-h-screen flex-col items-center p-12 text-black">
      {/* Messages container */}
      {RenderMessages()}

      {/* Form at the bottom */}
      {RenderForm()}
    </main>
  );

  // Inner render functions

  // Render form fixed at the bottom
  function RenderForm() {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event, {
            data: {
              prompt: input,
            },
          });
        }}
        className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-[80%] md:w-[70%] flex flex-row gap-2 items-center"
      >
        <textarea
          ref={textareaRef}
          placeholder={isLoading ? "Generating . . ." : "Type a Prompt . . . "}
          value={input}
          disabled={isLoading}
          onChange={handleInputChange}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent a new line
              handleSubmit(e, {
                data: {
                  prompt: input,
                },
              });
            }
          }}
          className="border-b bg-[#F4F4F4] border-dashed rounded-2xl outline-none w-full px-4 py-2 text-[#0842A0] placeholder:text-[#0842A099] text-right focus:placeholder-transparent disabled:bg-transparent resize-none overflow-hidden"
        />
        <button
          type="submit"
          className="rounded-full shadow-md border flex flex-row p-3 h-12 w-12 justify-center items-center"
        >
          {isLoading ? (
            <Loader2
              onClick={stop}
              className="animate-spin text-stone-500 h-6 w-6"
            />
          ) : (
            <Send className="text-stone-500 h-6 w-6" />
          )}
        </button>
      </form>
    );
  }
  
  

  // Render chat messages
  function RenderMessages() {
    return (
      <div
        id="chatbox"
        className="flex flex-col w-full text-left mt-4 gap-4 whitespace-pre-wrap overflow-y-auto flex-grow pb-20"
      >
        {messages.map((m, index) => {
          return (
            <div
              key={index}
              className={`px-5 py-1 pt-7 shadow-md rounded-3xl relative lg:mx-[200px] ${
                m.role === "user" ? "bg-stone-100 self-end" : "bg-white self-start"
              }`}
              style={{
                maxWidth: "85%", // Restrict maximum width
                wordBreak: "break-word", // Ensure long content wraps properly
                // margin: "0 250px 0 250px", 
              }}
            >
              <Markdown text={m.content} />
              {m.role === "user" ? (
                <User2 className="absolute top-2 -left-10 border rounded-full p-1 shadow-lg" />
              ) : (
                <Bot
                  className={`absolute top-2 -left-10 border rounded-full p-1 shadow-lg stroke-[#0842A0] ${
                    isLoading && index === messages.length - 1 
                      ? "animate-bounce"
                      : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
  
}
