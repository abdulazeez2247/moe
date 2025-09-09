import React, { useState, useRef, useEffect } from "react";
import { questionsAPI } from "../services/api";

const ChatInterface = ({ userPlan = "free", onUpgradeClick }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await questionsAPI.askQuestion({
        message: inputMessage,
        platform: "mozaik",
        version: null,
      });

      const { data } = response.data;
      if (data && data.answer) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.answer,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
          modelUsed: data.modelUsed,
          tokensUsed: data.tokens || 0,
          answerId: data.answerId,
          isCacheHit: data.isCacheHit,
          sources: data.sources || [],
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      if (error.response?.data?.upgradeRequired) {
        const botMessage = {
          id: Date.now() + 1,
          text: `I'd love to help with "${inputMessage}", but you've reached your daily limit. Upgrade to continue getting expert millwork guidance.`,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
          modelUsed: "gpt-4o-mini",
          upgradeRequired: true,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const botMessage = {
          id: Date.now() + 1,
          text: error.message || "Something went wrong. Please try again.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
          modelUsed: "gpt-4o-mini",
          error: true,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (answerId, vote) => {
    try {
      await questionsAPI.voteAnswer(answerId, { vote });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.answerId === answerId ? { ...msg, userVote: vote } : msg
        )
      );
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const getUpgradePrompt = () => {
    if (userPlan !== "free") return null;

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Upgrade to Pro for Enhanced Features
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Pro answers include Mozaik menu paths step-by-step, joinery and
                CNC checks, and install notes. Free answers are brief and
                generic.
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={onUpgradeClick}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMessageContent = (message) => {
    if (message.upgradeRequired) {
      return (
        <div>
          <p>{message.text}</p>
          <button
            onClick={onUpgradeClick}
            className="mt-2 bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
          >
            Upgrade to Continue
          </button>
        </div>
      );
    }

    if (message.error) {
      return (
        <div className="text-red-600">
          <p>{message.text}</p>
        </div>
      );
    }

    return (
      <div>
        <p className="text-sm">{message.text}</p>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">Sources:</p>
            <ul className="text-xs text-gray-400">
              {message.sources.map((source, index) => (
                <li key={index}>• {source}</li>
              ))}
            </ul>
          </div>
        )}
        {message.answerId && (
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => handleVote(message.answerId, "up")}
              className={`text-xs px-2 py-1 rounded ${
                message.userVote === "up"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              👍 Helpful
            </button>
            <button
              onClick={() => handleVote(message.answerId, "down")}
              className={`text-xs px-2 py-1 rounded ${
                message.userVote === "down"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              👎 Not Helpful
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 0 ? (
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">MOE</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Examples</h2>
                  <ul className="space-y-3">
                    <li>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
                        "Design a kitchen cabinet with specific dimensions"
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
                        "Help me troubleshoot Mozaik software issues"
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
                        "Calculate material requirements for my project"
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Capabilities</h2>
                  <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Remembers context within conversations
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Provides step-by-step Mozaik instructions
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Analyzes uploaded millwork files
                    </li>
                  </ul>
          </div>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Limitations</h2>
                  <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      May occasionally provide incorrect information
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Limited to millwork-specific knowledge
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Cannot modify or create files directly
                    </li>
                  </ul>
          </div>
        </div>
      </div>
          ) : (
            <div className="space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`group relative flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                    {/* Avatar */}
                    <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border ${
                      message.sender === "user"
                        ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                        : "bg-primary-500/10 border-primary-500/20"
                    }`}>
                      {message.sender === "user" ? (
                        <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      ) : (
                        <span className="text-lg font-semibold text-primary-600">M</span>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`relative flex-1 overflow-hidden rounded-lg px-4 py-3 text-sm ${
                message.sender === "user"
                  ? "bg-primary-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}>
                      <div className="prose dark:prose-invert max-w-none">
              {renderMessageContent(message)}
                      </div>

                      {/* Message Footer */}
                      {message.sender === "bot" && (
                        <div className="mt-3 flex items-center gap-3 border-t border-gray-200 dark:border-gray-600 pt-2">
                          {message.modelUsed && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Model: {message.modelUsed}
                            </span>
                          )}
                          {message.isCacheHit && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                              Cached Response
                            </span>
                          )}
                          <div className="flex-1" />
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                          </button>
                        </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 shrink-0 rounded-md bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary-600">M</span>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:0.2s]" />
                        <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Thinking...
                      </span>
              </div>
            </div>
          </div>
        )}
            </div>
          )}
        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Message MOE..."
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 pl-4 pr-12 py-3 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-40"
          >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
          </button>
        </form>

          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {userPlan === "free" ? (
                <>
                  Free Plan: {5 - messages.length} queries remaining today.{" "}
                  <button
                    onClick={onUpgradeClick}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    Upgrade for unlimited access
                  </button>
                </>
              ) : (
                "Pro Plan: Unlimited access"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
