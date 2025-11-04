import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEmotionalDashboard } from '@/contexts/EmotionalDashboardContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import EmotionalQuiz from '@/components/EmotionalQuiz';
import Dashboard from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Seo from "@/components/Seo";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.8,
};

const NotConnectedView = ({ onStartQuiz }) => (
    <div className="flex items-center justify-center min-h-[60vh] text-center">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-md"
        >
            <img
              src="https://i.imgur.com/Y6OG1mr.png"
              alt="Logo Mil'Aura"
              className="w-28 h-28 mx-auto mb-6 opacity-80"
            />
            <h1 className="text-3xl font-script text-gradient-gold-warm mb-2">🌸 Bienvenue dans ton espace Mil’Aura</h1>
            <p className="text-gray-600 mb-4">
                Découvre la bougie qui reflète ton énergie du moment.
            </p>
             <p className="text-gray-700 font-semibold mb-8">
                Commence ton Test Émotionnel pour révéler ta création personnalisée.
            </p>
            <Button onClick={onStartQuiz} size="lg" className="btn-golden-animated !px-8 !py-6 !text-lg">
                Faire le test maintenant ✨
            </Button>
        </motion.div>
    </div>
);


const EmotionalDashboardPage = () => {
  const { quizResult, saveQuizResult, loading: dashboardLoading, resetQuiz } = useEmotionalDashboard();
  const { session, loading: authLoading } = useAuth();
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);

  const handleStartQuiz = () => {
    resetQuiz(); // Clear previous results before starting
    setIsTakingQuiz(true);
  };
  
  const handleQuizComplete = (result) => {
    saveQuizResult(result);
    setIsTakingQuiz(false);
  };
  
  const handleRetakeQuiz = () => {
    resetQuiz();
    setIsTakingQuiz(true);
  }

  const renderContent = () => {
    if (authLoading || dashboardLoading) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Loader2 className="w-16 h-16 text-gray-400 animate-spin" />
        </div>
      );
    }
    
    if (isTakingQuiz) {
        return <EmotionalQuiz onComplete={handleQuizComplete} />;
    }

    if (!session) {
        // Not logged in, and not actively taking the quiz
        if (quizResult) {
            // Guest has a result
            return <Dashboard quizResult={quizResult} onRetakeQuiz={handleRetakeQuiz} />;
        }
        // Guest has no result, show invitation
        return <NotConnectedView onStartQuiz={handleStartQuiz} />;
    }
    
    // Logged in
    if (quizResult) {
        return <Dashboard quizResult={quizResult} onRetakeQuiz={handleRetakeQuiz} />;
    }
    
    // Logged in, but no quiz result yet, start quiz
    return <EmotionalQuiz onComplete={handleQuizComplete} />;
  };

  return (
    <>
      <Seo
        title="Votre profil émotionnel – Dashboard"
        description="Votre espace pour suivre votre météo émotionnelle et votre bougie du moment."
        canonical="https://milaura.fr/profil"
      />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="pt-24 md:pt-28 pb-12 px-4 bg-[#FBF9F4]"
        style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c7b28a\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}
      >
        {renderContent()}
      </motion.div>
    </>
  );
};

export default EmotionalDashboardPage;