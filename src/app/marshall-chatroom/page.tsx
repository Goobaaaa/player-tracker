"use client";

import { useState, useEffect, useRef } from "react";
import { NavigationLayout } from "@/components/navigation-layout";
import { createClient } from "@/lib/supabase";
import { getChatMessages, createChatMessage, updateChatMessage, deleteChatMessage } from "@/lib/data";
import { ChatMessage } from "@/lib/database";
import Image from "next/image";
import { MessageSquare, Send, Trash2, Edit, X, Upload, Smile } from "lucide-react";

export default function MarshallChatroomPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMessageForReaction, setSelectedMessageForReaction] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡", "🎉", "👏", "🙏", "💪", "🔥", "✅"];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase.auth]);

  useEffect(() => {
    const fetchMessages = async () => {
      const initialMessages = await getChatMessages();
      setMessages(initialMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    };
    fetchMessages();

    const channel = supabase
      .channel('realtime-chat')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, (payload) => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return;
    if (!user) return;

    const message: Omit<ChatMessage, 'id' | 'createdAt'> = {
      authorId: user.id,
      authorName: user.user_metadata?.name || 'Unknown User',
      content: newMessage.trim(),
      reactions: {},
      mediaUrls: selectedImage ? [selectedImage] : []
    };

    await createChatMessage(message);
    setNewMessage("");
    setSelectedImage(null);
  };

  const handleEditMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setEditingMessageId(messageId);
      setEditingContent(message.content);
    }
  };

  const handleSaveEdit = async (messageId: string) => {
    await updateChatMessage(messageId, {
      content: editingContent,
      editedAt: new Date().toISOString()
    });
    setEditingMessageId(null);
    setEditingContent("");
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      await deleteChatMessage(messageId);
    }
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    if (!user) return;
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    const reactions = { ...message.reactions };

    if (!reactions[emoji]) {
      reactions[emoji] = [];
    }

    const userIndex = reactions[emoji].indexOf(user.id);
    if (userIndex > -1) {
      reactions[emoji].splice(userIndex, 1);
      if (reactions[emoji].length === 0) {
        delete reactions[emoji];
      }
    } else {
      reactions[emoji].push(user.id);
    }

    await updateChatMessage(messageId, { reactions });
    setSelectedMessageForReaction(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const canEditMessage = (message: ChatMessage) => {
    return message.authorId === user?.id || user?.role === 'admin';
  };

  const canDeleteMessage = (message: ChatMessage) => {
    return message.authorId === user?.id || user?.role === 'admin';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <NavigationLayout>
      <div className="flex-1 flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <MessageSquare className="h-6 w-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">Marshall Chatroom</h1>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const showDateHeader = !prevMessage ||
              formatDate(prevMessage.createdAt) !== formatDate(message.createdAt);

            return (
              <div key={message.id}>
                {showDateHeader && (
                  <div className="text-center my-4">
                    <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-sm">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                )}

                <div className={`flex items-start space-x-3 ${message.authorId === user?.id ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {message.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className={`max-w-lg ${message.authorId === user?.id ? 'items-end' : ''}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-blue-400">{message.authorName}</span>
                      <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
                      {message.editedAt && <span className="text-xs text-gray-500">(edited)</span>}
                    </div>

                    {editingMessageId === message.id ? (
                      <div className="bg-gray-800 rounded-lg p-3">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded text-white px-2 py-1 text-sm resize-none"
                          rows={2}
                        />
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => handleSaveEdit(message.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingMessageId(null);
                              setEditingContent("");
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={`bg-gray-800 rounded-lg p-3 group relative ${message.authorId === user?.id ? 'bg-blue-800' : ''}`}>
                        <p className="text-white text-sm whitespace-pre-wrap">{message.content}</p>

                        {message.mediaUrls && message.mediaUrls.map((url, idx) => (
                          <div key={idx} className="mt-2">
                            <Image
                              src={url}
                              alt="Message media"
                              width={200}
                              height={150}
                              className="rounded object-cover cursor-pointer"
                              onClick={() => window.open(url, '_blank')}
                            />
                          </div>
                        ))}

                        {/* Reactions */}
                        {Object.keys(message.reactions).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {Object.entries(message.reactions).map(([emoji, userIds]) => (
                              <button
                                key={emoji}
                                onClick={() => handleAddReaction(message.id, emoji)}
                                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                                  userIds.includes(user?.id || '1')
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                <span>{emoji}</span>
                                <span>{userIds.length}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Action buttons */}
                        {(canEditMessage(message) || canDeleteMessage(message)) && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                            {canEditMessage(message) && (
                              <button
                                onClick={() => handleEditMessage(message.id)}
                                className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                            )}
                            {canDeleteMessage(message) && (
                              <button
                                onClick={() => handleDeleteMessage(message.id)}
                                className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedMessageForReaction(message.id)}
                              className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
                            >
                              <Smile className="h-3 w-3" />
                            </button>
                          </div>
                        )}

                        {/* Reaction picker for non-authors */}
                        {!canEditMessage(message) && (
                          <button
                            onClick={() => setSelectedMessageForReaction(message.id)}
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Smile className="h-4 w-4 text-gray-400 hover:text-white" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          {selectedImage && (
            <div className="mb-3 relative inline-block">
              <Image
                src={selectedImage}
                alt="Preview"
                width={100}
                height={100}
                className="rounded object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
            >
              <Upload className="h-5 w-5" />
            </button>

            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-2 resize-none focus:border-blue-500 focus:outline-none"
                rows={2}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && !selectedImage}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Emoji Picker Modal */}
      {selectedMessageForReaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-center mb-3">
              <h3 className="text-white font-medium">Add Reaction</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleAddReaction(selectedMessageForReaction, emoji)}
                  className="text-2xl hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedMessageForReaction(null)}
              className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
    </NavigationLayout>
  );
}