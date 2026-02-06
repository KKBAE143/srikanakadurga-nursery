import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Search,
  Mail,
  Phone,
  Calendar,
  Eye,
  Check,
  Reply,
  Archive,
  X,
} from "lucide-react";

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
  status?: "unread" | "read" | "replied" | "archived";
}

export default function MessageList() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesQuery = query(
          collection(db, "contactMessages"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(messagesQuery);
        const msgs = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: doc.data().status || "unread",
        })) as ContactMessage[];
        setMessages(msgs);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const updateStatus = async (id: string, status: ContactMessage["status"]) => {
    try {
      await updateDoc(doc(db, "contactMessages", id), { status });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      toast({
        title: "Status updated",
        description: `Message marked as ${status}.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update message status.",
        variant: "destructive",
      });
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    unread: "bg-blue-50 text-blue-700",
    read: "bg-gray-50 text-gray-700",
    replied: "bg-green-50 text-green-700",
    archived: "bg-amber-50 text-amber-700",
  };

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <AdminLayout
      title="Messages"
      subtitle={`${messages.length} total messages${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
    >
      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#e5ebe3] p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F9E8B]" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm cursor-pointer"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#e5ebe3] overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-[#8F9E8B] opacity-50" />
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">
                  No messages found
                </h3>
                <p className="text-[#8F9E8B] text-sm">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters."
                    : "Messages from your contact form will appear here."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#e5ebe3] max-h-[600px] overflow-y-auto">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === "unread") {
                        updateStatus(msg.id, "read");
                      }
                    }}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedMessage?.id === msg.id
                        ? "bg-[#EAEFE9]"
                        : msg.status === "unread"
                        ? "bg-blue-50/50 hover:bg-[#f8faf7]"
                        : "hover:bg-[#f8faf7]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#2F4836] rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                        {msg.fullName[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className={`font-medium text-sm truncate ${msg.status === "unread" ? "text-[#1A1A1A]" : "text-[#4A4A4A]"}`}>
                            {msg.fullName}
                          </p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[msg.status || "unread"]}`}>
                            {msg.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#8F9E8B] truncate mb-1">{msg.email}</p>
                        <p className="text-sm text-[#4A4A4A] line-clamp-2">{msg.message}</p>
                        <p className="text-xs text-[#8F9E8B] mt-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          {selectedMessage ? (
            <div className="bg-white rounded-xl border border-[#e5ebe3] overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-[#e5ebe3]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#2F4836] rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedMessage.fullName[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-heading text-xl font-bold text-[#1A1A1A]">
                        {selectedMessage.fullName}
                      </h2>
                      <div className="flex items-center gap-4 mt-1">
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-sm text-[#2F4836] hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-4 h-4" />
                          {selectedMessage.email}
                        </a>
                        {selectedMessage.phone && (
                          <a
                            href={`tel:${selectedMessage.phone}`}
                            className="text-sm text-[#2F4836] hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-4 h-4" />
                            {selectedMessage.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 text-[#8F9E8B] hover:text-[#1A1A1A] hover:bg-[#f8faf7] rounded-lg transition-colors lg:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {selectedMessage.subject && (
                  <div className="mt-4 p-3 bg-[#f8faf7] rounded-lg">
                    <span className="text-xs font-medium text-[#8F9E8B] uppercase">Subject</span>
                    <p className="text-sm text-[#1A1A1A] font-medium mt-1">{selectedMessage.subject}</p>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="p-6">
                <p className="text-[#4A4A4A] whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>

                <p className="text-sm text-[#8F9E8B] mt-6 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-[#e5ebe3] flex flex-wrap gap-2">
                <button
                  onClick={() => updateStatus(selectedMessage.id, "read")}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-[#e5ebe3] hover:bg-[#f8faf7] transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Mark as Read
                </button>
                <button
                  onClick={() => updateStatus(selectedMessage.id, "replied")}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-[#e5ebe3] hover:bg-[#f8faf7] transition-colors flex items-center gap-2"
                >
                  <Reply className="w-4 h-4" />
                  Mark as Replied
                </button>
                <button
                  onClick={() => updateStatus(selectedMessage.id, "archived")}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-[#e5ebe3] hover:bg-[#f8faf7] transition-colors flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your inquiry"}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[#2F4836] text-white hover:bg-[#243a2b] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#e5ebe3] p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#EAEFE9] rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-[#2F4836]" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">
                Select a message
              </h3>
              <p className="text-[#8F9E8B] text-sm">
                Click on a message from the list to view its details.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
