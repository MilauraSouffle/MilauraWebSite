import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        toast({
          variant: "destructive",
          title: "Échec de l'inscription",
          description: "Cette adresse e-mail est déjà utilisée. Veuillez vous connecter.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Échec de l'inscription",
          description: error.message || "Une erreur est survenue.",
        });
      }
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      // This case handles when a user exists but is not confirmed. Supabase returns a user object but no session.
      // For a better UX, we can treat this as "user already exists".
      toast({
        variant: "destructive",
        title: "Utilisateur existant",
        description: "Un compte avec cet e-mail existe déjà. Veuillez vérifier vos e-mails pour confirmer votre compte ou connectez-vous.",
      });
       setLoading(false);
      return { data, error: { message: "User already exists" } };
    } else if (data.user) {
        toast({
            title: "🎉 Compte créé !",
            description: "Bienvenue ! Un email de confirmation vous a été envoyé.",
        });
    }
    setLoading(false);
    return { data, error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Échec de la connexion",
        description: "Email ou mot de passe incorrect.",
      });
    } else {
        toast({
            title: "Connexion réussie !",
            description: "Heureux de vous revoir.",
        });
    }
    setLoading(false);
    return { error };
  }, [toast]);

  const signOut = useCallback(async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Échec de la déconnexion",
        description: error.message || "Une erreur est survenue.",
      });
    } else {
        toast({
            title: "Déconnexion",
            description: "À bientôt !",
        });
    }
    setLoading(false);
    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};