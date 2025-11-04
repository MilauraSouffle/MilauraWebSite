import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, TrendingUp, User, LogOut, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const productsImages = {
    'Bougie Sérénité': 'https://horizons-cdn.hostinger.com/5ed1deb4-535d-4bff-8341-dc46a5456047/a3809623-a55e-4c7b-b8c7-43407c5ac154.png',
    'Bougie Protection': 'https://horizons-cdn.hostinger.com/5ed1deb4-535d-4bff-8341-dc46a5456047/b8d76d49-411a-474c-83b3-56da472b53a3.png',
    'Bougie Élégance': 'https://horizons-cdn.hostinger.com/5ed1deb4-535d-4bff-8341-dc46a5456047/4bca992e-3b1a-4638-ba49-0744033c9428.png',
    'Bougie Joie': 'https://horizons-cdn.hostinger.com/5ed1deb4-535d-4bff-8341-dc46a5456047/5a0c024d-6169-42c2-8418-5a083a2164f0.png',
    'Bougie Réconfort': 'https://horizons-cdn.hostinger.com/5ed1deb4-535d-4bff-8341-dc46a5456047/6f4142f1-f8e1-450f-a49e-13c5457f0f6e.png',
};

const candleBenefits = {
    'Bougie Sérénité': ['Apaise le mental', 'Favorise l’intuition', 'Aide à la méditation'],
    'Bougie Protection': ['Repousse les énergies négatives', 'Renforce l’ancrage', 'Apporte un sentiment de sécurité'],
    'Bougie Élégance': ['Ouvre le cœur à l’amour', 'Guérit les blessures émotionnelles', 'Favorise la tendresse'],
    'Bougie Joie': ['Apporte optimisme et gaieté', 'Stimule la créativité', 'Attire la chance'],
    'Bougie Réconfort': ['Calme les angoisses', 'Apporte douceur et réconfort', 'Facilite la communication'],
};

const Dashboard = ({ quizResult, onRetakeQuiz }) => {
    const { session, user, signOut } = useAuth();
    const { toast } = useToast();

    const { name, stone, scent, phrase, productId, emotionalWeather } = quizResult;
    const benefits = candleBenefits[name] || [];
    const imageUrl = productsImages[name] || 'https://images.unsplash.com/photo-1617213146999-f33c20d2a534';
    
    const handleSignOut = async () => {
        await signOut();
        toast({ title: "Déconnexion réussie", description: "À bientôt !" });
    };

    const handleGoToProduct = () => {
        toast({
            title: "🚧 Bientôt disponible !",
            description: "Le lien vers la boutique sera bientôt activé.",
        });
    };

    return (
        <div className="container mx-auto max-w-6xl py-12 px-4">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-4xl font-script text-gradient-gold-warm">
                        Bienvenue, {user?.email || 'dans votre espace'}
                    </h1>
                    {session && user ? (
                        <p className="text-gray-500">Heureux de vous revoir.</p>
                    ) : (
                         <p className="text-gray-500">Votre révélation vous attend.</p>
                    )}
                </div>
                {session && (
                    <Button variant="ghost" className="rounded-full text-sm shrink-0" onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" /> Déconnexion
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.5 } }}
                    className="bg-white/30 backdrop-blur-md p-8 rounded-3xl golden-frame"
                >
                    <div className="bg-[#FBF9F4] rounded-[22px] p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-amber-500" />
                            Votre Bougie du Moment
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="relative">
                                <img alt={`Bougie ${name}`} className="w-full h-auto object-cover rounded-2xl shadow-lg shadow-amber-900/10" src={imageUrl} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
                                <p className="text-md text-[#C3A46D] font-semibold mb-3">{stone} & {scent}</p>
                                <div className="space-y-2 mb-4">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <Heart className="w-4 h-4 text-amber-400" />
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                         <p className="text-md text-gray-600 italic text-center mt-6 mb-6">"{phrase}"</p>
                        <Button onClick={handleGoToProduct} size="lg" className="w-full btn-golden-animated !py-6">
                            Découvrir ma bougie ✨
                        </Button>
                    </div>
                </motion.div>

                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                        className="glass-effect p-8 rounded-3xl"
                    >
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-amber-500" />
                            Votre Météo Émotionnelle
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(emotionalWeather).map(([emotion, score]) => (
                                <div key={emotion}>
                                    <div className="flex justify-between mb-1 text-sm">
                                        <span className="capitalize font-medium text-gray-700">{emotion}</span>
                                        <span className="font-semibold text-gray-600">{Math.round(score)}%</span>
                                    </div>
                                    <div className="h-2.5 bg-black/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${score}%` }}
                                            transition={{ duration: 1, delay: 0.6 }}
                                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
                        className="glass-effect p-8 rounded-3xl flex flex-col items-center justify-center text-center"
                    >
                        <Edit className="w-8 h-8 text-amber-500 mb-4" />
                        <h3 className="text-2xl font-bold mb-3">Besoin d'une nouvelle analyse ?</h3>
                        <p className="text-gray-600 mb-6">Vos émotions évoluent, vos besoins aussi.</p>
                         <Button onClick={onRetakeQuiz} variant="outline" className="w-full max-w-xs rounded-full border-amber-300/50 bg-white hover:bg-amber-50/20">
                            ✨ Refaire le test émotionnel
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;