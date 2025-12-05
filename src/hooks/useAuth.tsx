import { useState, useEffect, createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface UserRole {
  role: string;
  branch_id: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Handle token refresh errors
        if (event === 'TOKEN_REFRESHED' && !session) {
          // Clear invalid session
          setSession(null);
          setUser(null);
          setUserRole(null);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role with setTimeout to avoid deadlock
          setTimeout(async () => {
            try {
              const { data } = await supabase
                .from("user_roles")
                .select("role, branch_id")
                .eq("user_id", session.user.id)
                .single();
              
              setUserRole(data);
            } catch (error) {
              console.error("Error fetching user role:", error);
              setUserRole(null);
            }
            setLoading(false);
          }, 0);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      // Handle invalid refresh token error
      if (error) {
        console.error("Session error:", error);
        // Clear any stale session data
        setSession(null);
        setUser(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from("user_roles")
          .select("role, branch_id")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data }) => {
            setUserRole(data);
            setLoading(false);
          })
          .catch(() => {
            setUserRole(null);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }).catch(() => {
      // Handle any unexpected errors
      setSession(null);
      setUser(null);
      setUserRole(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
