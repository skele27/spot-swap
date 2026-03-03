/*
  This page is the messages page where users can view and send messages to other users.
*/

"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FiSend, FiMessageSquare, FiUser } from "react-icons/fi";

function MessagesContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const recipientId = searchParams.get("to");
  const listingId = searchParams.get("listingId");

  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const messagesEndRef = useRef(null);

  // Load messages of the user
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", user.uid),
      orderBy("lastMessageAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversations(convos);

      if (recipientId && listingId) {
        const existingConvo = convos.find(
          (c) => c.participants.includes(recipientId) && c.listingId === listingId
        );
        if (existingConvo) setActiveConvo(existingConvo);
      }
    });

    return () => unsubscribe();
  }, [user, recipientId, listingId]);

  // Fetch name
  useEffect(() => {
    async function fetchRecipient() {
      if (!recipientId) return;
      try {
        const userDoc = await getDoc(doc(db, "users", recipientId));
        if (userDoc.exists()) {
          setRecipientName(userDoc.data().displayName || "User");
        }
      } catch (err) {
        console.error("Error fetching recipient:", err);
      }
    }
    fetchRecipient();
  }, [recipientId]);

  // Load messages of the active conversation
  useEffect(() => {
    if (!activeConvo) return;

    const q = query(
      collection(db, "conversations", activeConvo.id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [activeConvo]);

  // Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      let convoId;

      if (activeConvo) {
        convoId = activeConvo.id;
      } else if (recipientId) {
        const convoRef = await addDoc(collection(db, "conversations"), {
          participants: [user.uid, recipientId],
          participantNames: {
            [user.uid]: user.displayName || "Anonymous",
            [recipientId]: recipientName || "User",
          },
          listingId: listingId || "",
          lastMessage: newMessage.trim(),
          lastMessageAt: serverTimestamp(),
        });
        convoId = convoRef.id;
        setActiveConvo({ id: convoId, participants: [user.uid, recipientId] });
      } else {
        return;
      }

      await addDoc(collection(db, "conversations", convoId, "messages"), {
        text: newMessage.trim(),
        senderId: user.uid,
        senderName: user.displayName || "Anonymous",
        createdAt: serverTimestamp(),
      });

      const { updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "conversations", convoId), {
        lastMessage: newMessage.trim(),
        lastMessageAt: serverTimestamp(),
      });

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  // Auth check
  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="h-6 w-32 bg-gray-700 rounded animate-pulse mx-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Sign In Required</h1>
        <p className="text-muted mb-6">
          You need to be signed in to view your messages.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">

        {/* Convo List */}
        <div className="md:col-span-1 bg-card-bg rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Conversations</h2>
          </div>
          <div className="overflow-y-auto h-[calc(600px-60px)]">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted text-sm">
                No conversations yet.
              </div>
            ) : (
              conversations.map((convo) => {
                const otherUid = convo.participants?.find((p) => p !== user.uid);
                const otherName = convo.participantNames?.[otherUid] || "User";
                return (
                  <button
                    key={convo.id}
                    onClick={() => setActiveConvo(convo)}
                    className={`w-full text-left p-4 border-b border-border hover:bg-gray-800 transition-colors cursor-pointer ${
                      activeConvo?.id === convo.id ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FiUser className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{otherName}</p>
                        <p className="text-sm text-muted truncate">
                          {convo.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 bg-card-bg rounded-2xl border border-border flex flex-col overflow-hidden">
          {activeConvo || recipientId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">
                  {activeConvo
                    ? activeConvo.participantNames?.[
                        activeConvo.participants?.find((p) => p !== user.uid)
                      ] || "User"
                    : recipientName || "New Conversation"}
                </h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user.uid ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.senderId === user.uid
                          ? "bg-primary text-white rounded-br-md"
                          : "bg-gray-700 text-foreground rounded-bl-md"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === user.uid ? "text-blue-200" : "text-muted"}`}>
                        {msg.createdAt?.toDate
                          ? msg.createdAt.toDate().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
                          : ""}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-border flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <FiSend />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted">
              <div className="text-center">
                <FiMessageSquare className="text-4xl mx-auto mb-3" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="h-6 w-32 bg-gray-700 rounded animate-pulse mx-auto" />
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
