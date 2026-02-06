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
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { seedFirestoreData } from "@/lib/firestore";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/blog" component={Blog} />
      <Route path="/cart" component={Cart} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/profile" component={Profile} />
      <Route path="/wishlist" component={Wishlist} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    seedFirestoreData().then(() => setSeeded(true)).catch(() => setSeeded(true));
  }, []);

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
