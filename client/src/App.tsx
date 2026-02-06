import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Blog from "@/pages/Blog";
import Cart from "@/pages/Cart";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ProductDetail from "@/pages/ProductDetail";
import Profile from "@/pages/Profile";
import Wishlist from "@/pages/Wishlist";
import About from "@/pages/About";
import BlogDetail from "@/pages/BlogDetail";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminGuard from "@/components/guards/AdminGuard";
import Dashboard from "@/admin/pages/Dashboard";
import ProductList from "@/admin/pages/ProductList";
import ProductForm from "@/admin/pages/ProductForm";
import CategoryList from "@/admin/pages/CategoryList";
import BlogList from "@/admin/pages/BlogList";
import BlogEditor from "@/admin/pages/BlogEditor";
import MessageList from "@/admin/pages/MessageList";
import HomepageEditor from "@/admin/pages/HomepageEditor";
import Settings from "@/admin/pages/Settings";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/profile" component={Profile} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/about" component={About} />

      {/* Admin Routes - Protected by AdminGuard */}
      <Route path="/admin">
        {() => (
          <AdminGuard>
            <Dashboard />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/products">
        {() => (
          <AdminGuard>
            <ProductList />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/products/new">
        {() => (
          <AdminGuard>
            <ProductForm />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/products/:id">
        {() => (
          <AdminGuard>
            <ProductForm />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/categories">
        {() => (
          <AdminGuard>
            <CategoryList />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/blog">
        {() => (
          <AdminGuard>
            <BlogList />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/blog/new">
        {() => (
          <AdminGuard>
            <BlogEditor />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/blog/:id">
        {() => (
          <AdminGuard>
            <BlogEditor />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/messages">
        {() => (
          <AdminGuard>
            <MessageList />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/homepage">
        {() => (
          <AdminGuard>
            <HomepageEditor />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/settings">
        {() => (
          <AdminGuard>
            <Settings />
          </AdminGuard>
        )}
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
