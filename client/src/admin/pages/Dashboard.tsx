import { useEffect, useState } from "react";
import { Link } from "wouter";
import AdminLayout from "../components/AdminLayout";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { products as staticProducts, blogPosts as staticBlogs } from "@/lib/data";
import {
  Package,
  FileText,
  MessageSquare,
  Users,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Eye,
  ShoppingBag,
  Calendar,
  Sparkles,
  Zap,
  BarChart3,
} from "lucide-react";

interface StatsData {
  totalProducts: number;
  totalBlogs: number;
  totalMessages: number;
  totalUsers: number;
  unreadMessages: number;
}

interface RecentMessage {
  id: string;
  fullName: string;
  email: string;
  subject?: string;
  createdAt: string;
  status?: string;
}

interface RecentBlog {
  id: string;
  title: string;
  status: string;
  date: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatsData>({
    totalProducts: 0,
    totalBlogs: 0,
    totalMessages: 0,
    totalUsers: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        const usersSnap = await getDocs(collection(db, "users"));
        const usersCount = usersSnap.size;

        // Fetch messages
        const messagesSnap = await getDocs(collection(db, "contactMessages"));
        const messagesCount = messagesSnap.size;

        // Count unread messages
        const unreadQuery = query(
          collection(db, "contactMessages"),
          where("status", "==", "unread")
        );
        const unreadSnap = await getDocs(unreadQuery);
        const unreadCount = unreadSnap.size;

        // Fetch recent messages
        const recentQuery = query(
          collection(db, "contactMessages"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const recentSnap = await getDocs(recentQuery);
        const recent = recentSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as RecentMessage[];

        // Try to fetch products from Firestore, fallback to static
        let productsCount = staticProducts.length;
        try {
          const productsSnap = await getDocs(collection(db, "products"));
          if (productsSnap.size > 0) {
            productsCount = productsSnap.size;
          }
        } catch {
          // Use static count
        }

        // Try to fetch blogs from Firestore, fallback to static
        let blogsCount = staticBlogs.length;
        try {
          const blogsSnap = await getDocs(collection(db, "blogPosts"));
          if (blogsSnap.size > 0) {
            blogsCount = blogsSnap.size;
            // Get recent blogs
            const recentBlogsQuery = query(
              collection(db, "blogPosts"),
              orderBy("createdAt", "desc"),
              limit(3)
            );
            const recentBlogsSnap = await getDocs(recentBlogsQuery);
            setRecentBlogs(
              recentBlogsSnap.docs.map((doc) => ({
                id: doc.id,
                title: doc.data().title,
                status: doc.data().status,
                date: doc.data().date || doc.data().createdAt,
              }))
            );
          } else {
            // Use static blogs
            setRecentBlogs(
              staticBlogs.slice(0, 3).map((blog) => ({
                id: blog.id,
                title: blog.title,
                status: "published",
                date: blog.date,
              }))
            );
          }
        } catch {
          // Use static count
        }

        setStats({
          totalProducts: productsCount,
          totalBlogs: blogsCount,
          totalMessages: messagesCount,
          totalUsers: usersCount,
          unreadMessages: unreadCount,
        });
        setRecentMessages(recent);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: <Package className="w-5 h-5" />,
      color: "from-[#2F4836] to-[#4a6b52]",
      bgColor: "bg-[#EAEFE9]",
      textColor: "text-[#2F4836]",
      href: "/admin/products",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Blog Posts",
      value: stats.totalBlogs,
      icon: <FileText className="w-5 h-5" />,
      color: "from-[#3a5a44] to-[#5a7a64]",
      bgColor: "bg-[#EAEFE9]",
      textColor: "text-[#2F4836]",
      href: "/admin/blog",
      change: "+8%",
      trend: "up",
    },
    {
      label: "Messages",
      value: stats.totalMessages,
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined,
      icon: <MessageSquare className="w-5 h-5" />,
      color: "from-[#4a6b52] to-[#6a8b72]",
      bgColor: "bg-[#EAEFE9]",
      textColor: "text-[#2F4836]",
      href: "/admin/messages",
      change: stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : "0 new",
      trend: stats.unreadMessages > 0 ? "up" : "neutral",
    },
    {
      label: "Users",
      value: stats.totalUsers,
      icon: <Users className="w-5 h-5" />,
      color: "from-[#243a2b] to-[#2F4836]",
      bgColor: "bg-[#EAEFE9]",
      textColor: "text-[#2F4836]",
      href: "#",
      change: "+5%",
      trend: "up",
    },
  ];

  const quickActions = [
    {
      label: "Add Product",
      description: "Create a new plant listing",
      href: "/admin/products/new",
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "bg-[#2F4836]",
    },
    {
      label: "Write Blog",
      description: "Publish a new article",
      href: "/admin/blog/new",
      icon: <FileText className="w-5 h-5" />,
      color: "bg-[#3a5a44]",
    },
    {
      label: "View Messages",
      description: "Check customer inquiries",
      href: "/admin/messages",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "bg-[#4a6b52]",
    },
    {
      label: "Edit Homepage",
      description: "Customize landing page",
      href: "/admin/homepage",
      icon: <Eye className="w-5 h-5" />,
      color: "bg-[#243a2b]",
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <AdminLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] flex items-center gap-3">
              {getGreeting()}! <Sparkles className="w-6 h-6 text-amber-500" />
            </h1>
            <p className="text-[#8F9E8B] mt-1">
              Here's what's happening with your nursery today.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-[#8F9E8B]">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="group relative bg-white rounded-2xl border border-[#e5ebe3] p-5 hover:shadow-xl hover:shadow-black/5 hover:border-[#2F4836]/20 transition-all duration-300 cursor-pointer overflow-hidden">
              {/* Background Gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor}`}>
                    {stat.icon}
                  </div>
                  {stat.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                      {stat.badge} new
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-[#8F9E8B] text-sm font-medium">{stat.label}</p>
                  <div className="flex items-end justify-between mt-1">
                    <p className="text-3xl font-bold text-[#1A1A1A]">
                      {loading ? (
                        <span className="inline-block w-16 h-9 bg-gray-100 rounded-lg animate-pulse" />
                      ) : (
                        stat.value.toLocaleString()
                      )}
                    </p>
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      stat.trend === "up" ? "text-emerald-600" : "text-[#8F9E8B]"
                    }`}>
                      {stat.trend === "up" && <TrendingUp className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#e5ebe3] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium text-[#2F4836]">View details</span>
                  <ArrowUpRight className="w-4 h-4 text-[#2F4836]" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#e5ebe3] p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-[#2F4836] to-[#4ade80] rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-bold text-lg text-[#1A1A1A]">Quick Actions</h2>
            </div>

            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-[#f8faf7] cursor-pointer transition-all">
                    <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/10`}>
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1A1A1A] group-hover:text-[#2F4836] transition-colors">
                        {action.label}
                      </p>
                      <p className="text-xs text-[#8F9E8B] truncate">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8F9E8B] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Chart Placeholder */}
          <div className="bg-white rounded-2xl border border-[#e5ebe3] p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[#2F4836]" />
              <h2 className="font-bold text-lg text-[#1A1A1A]">This Week</h2>
            </div>
            <div className="flex items-end justify-between h-32 gap-2">
              {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-[#2F4836] to-[#4ade80] rounded-t-md transition-all hover:from-[#1a2e1f] hover:to-[#2F4836]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-[#8F9E8B]">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Messages */}
          <div className="bg-white rounded-2xl border border-[#e5ebe3] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#EAEFE9] rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-[#2F4836]" />
                </div>
                <h2 className="font-bold text-lg text-[#1A1A1A]">Recent Messages</h2>
              </div>
              <Link href="/admin/messages">
                <span className="text-[#2F4836] text-sm font-medium hover:underline cursor-pointer flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 p-4 bg-[#f8faf7] rounded-xl animate-pulse">
                    <div className="w-11 h-11 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="text-center py-12 bg-[#f8faf7] rounded-xl">
                <div className="w-16 h-16 bg-[#EAEFE9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-[#8F9E8B]" />
                </div>
                <p className="text-[#8F9E8B] font-medium">No messages yet</p>
                <p className="text-[#8F9E8B] text-sm mt-1">
                  Messages from customers will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <Link key={msg.id} href="/admin/messages">
                    <div className="flex gap-4 p-4 bg-[#f8faf7] hover:bg-[#EAEFE9] rounded-xl cursor-pointer transition-all group">
                      <div className="w-11 h-11 bg-gradient-to-br from-[#2F4836] to-[#4ade80] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-lg shadow-black/10">
                        {msg.fullName[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-[#1A1A1A] truncate group-hover:text-[#2F4836] transition-colors">
                            {msg.fullName}
                          </p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {msg.status === "unread" && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            <span className="text-xs text-[#8F9E8B] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-[#8F9E8B] truncate">{msg.email}</p>
                        {msg.subject && (
                          <p className="text-sm text-[#4A4A4A] truncate mt-1 font-medium">
                            {msg.subject}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Blog Posts */}
          <div className="bg-white rounded-2xl border border-[#e5ebe3] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#EAEFE9] rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#2F4836]" />
                </div>
                <h2 className="font-bold text-lg text-[#1A1A1A]">Recent Blog Posts</h2>
              </div>
              <Link href="/admin/blog">
                <span className="text-[#2F4836] text-sm font-medium hover:underline cursor-pointer flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 p-4 bg-[#f8faf7] rounded-xl animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentBlogs.length === 0 ? (
              <div className="text-center py-12 bg-[#f8faf7] rounded-xl">
                <div className="w-16 h-16 bg-[#EAEFE9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-[#8F9E8B]" />
                </div>
                <p className="text-[#8F9E8B] font-medium">No blog posts yet</p>
                <Link href="/admin/blog/new">
                  <button className="mt-3 px-4 py-2 bg-[#2F4836] text-white rounded-lg text-sm font-medium hover:bg-[#243a2b] transition-colors inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Write your first post
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBlogs.map((blog) => (
                  <Link key={blog.id} href={`/admin/blog/${blog.id}`}>
                    <div className="flex items-center gap-4 p-4 bg-[#f8faf7] hover:bg-[#EAEFE9] rounded-xl cursor-pointer transition-all group">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#2F4836] to-[#4a6b52] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1A1A1A] truncate group-hover:text-[#2F4836] transition-colors">
                          {blog.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              blog.status === "published"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {blog.status === "published" ? "Published" : "Draft"}
                          </span>
                          <span className="text-xs text-[#8F9E8B]">
                            {new Date(blog.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8F9E8B] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
