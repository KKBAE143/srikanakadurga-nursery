import { useState, useEffect } from "react";
import { Link } from "wouter";
import AdminLayout from "../components/AdminLayout";
import { blogPosts as staticBlogs, type BlogPost } from "@/lib/data";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  Eye,
  Calendar,
  User,
} from "lucide-react";

export default function BlogList() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsSnap = await getDocs(collection(db, "blogPosts"));
        if (blogsSnap.size > 0) {
          const firestoreBlogs = blogsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as BlogPost[];
          setBlogs(firestoreBlogs);
        } else {
          setBlogs(staticBlogs);
        }
      } catch {
        setBlogs(staticBlogs);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await deleteDoc(doc(db, "blogPosts", blogId));
      setBlogs((prev) => prev.filter((b) => b.id !== blogId));
      toast({
        title: "Blog deleted",
        description: "The blog post has been removed.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete blog post.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout
      title="Blog Posts"
      subtitle={`${blogs.length} articles published`}
      actions={
        <Link href="/admin/blog/new">
          <button className="bg-[#2F4836] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#243a2b] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Write New Post
          </button>
        </Link>
      }
    >
      {/* Search */}
      <div className="bg-white rounded-xl border border-[#e5ebe3] p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F9E8B]" />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
          />
        </div>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-[#e5ebe3] overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5ebe3] p-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-[#8F9E8B] opacity-50" />
          <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">
            No blog posts found
          </h3>
          <p className="text-[#8F9E8B] text-sm mb-4">
            {searchQuery ? "Try adjusting your search." : "Start by writing your first blog post."}
          </p>
          <Link href="/admin/blog/new">
            <button className="bg-[#2F4836] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#243a2b] transition-colors">
              Write Post
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl border border-[#e5ebe3] overflow-hidden hover:shadow-lg hover:border-[#2F4836]/30 transition-all group"
            >
              <div className="aspect-video bg-[#EAEFE9] relative overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Link href={`/blog/${blog.id}`}>
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#8F9E8B] hover:text-[#2F4836] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3 text-xs text-[#8F9E8B] mb-2">
                  {blog.author && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {blog.author}
                    </span>
                  )}
                  {blog.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.date).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-semibold text-[#1A1A1A] mb-2 line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-sm text-[#8F9E8B] line-clamp-2 mb-4">{blog.excerpt}</p>

                <div className="flex items-center justify-between pt-3 border-t border-[#e5ebe3]">
                  <Link href={`/admin/blog/${blog.id}`}>
                    <button className="text-[#2F4836] text-sm font-medium hover:underline flex items-center gap-1">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="text-red-500 text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
