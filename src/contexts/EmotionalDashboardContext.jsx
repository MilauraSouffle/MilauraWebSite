import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const EmotionalDashboardContext = createContext();

export const useEmotionalDashboard = () => useContext(EmotionalDashboardContext);

const LOCAL_STORAGE_KEY = 'milaura_emotional_profile';

export const EmotionalDashboardProvider = ({ children }) => {
    const { user, session } = useAuth();
    const [quizResult, setQuizResult] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('quiz_results')
                .eq('id', user.id)
                .single();

            if (data && data.quiz_results) {
                setQuizResult(data.quiz_results);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.quiz_results));
            } else if (error && error.code !== 'PGRST116') { // Ignore 'No rows found' error
                console.error('Error fetching profile:', error);
            }
        } catch (e) {
            console.error('An error occurred during fetchProfile:', e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            setQuizResult(JSON.parse(localData));
        }

        if (session) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [session, fetchProfile]);
    
    const saveQuizResult = useCallback(async (result) => {
        setQuizResult(result);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result));

        if (user) {
            const { error } = await supabase
                .from('user_profiles')
                .upsert({ id: user.id, quiz_results: result, updated_at: new Date().toISOString() });
            
            if (error) {
                console.error('Error saving profile to DB:', error);
            }
        }
    }, [user]);

    const resetQuiz = useCallback(() => {
        setQuizResult(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        if(user){
            // We only remove the quiz result, not the whole profile
            supabase
                .from('user_profiles')
                .update({ quiz_results: null, updated_at: new Date().toISOString() })
                .eq('id', user.id);
        }
    }, [user]);

    // Clear local storage on sign out to ensure a fresh state for the next guest or login
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setQuizResult(null);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <EmotionalDashboardContext.Provider value={{ quizResult, saveQuizResult, loading, resetQuiz }}>
            {children}
        </EmotionalDashboardContext.Provider>
    );
};