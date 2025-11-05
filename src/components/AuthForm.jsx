import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';

const AuthForm = () => {
    const { signIn, signUp, loading } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignUp) {
            await signUp(email, password);
        } else {
            await signIn(email, password);
        }
    };

    return (
        <div className="p-8 bg-[#FBF9F4] relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/30 to-transparent rounded-full filter blur-xl"></div>
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-[#BFA57C]/30 to-transparent rounded-full filter blur-xl"></div>
            
            <div className="text-center mb-6">
                <Sparkles className="mx-auto h-8 w-8 text-gradient-gold-warm mb-2" />
                <h2 className="text-3xl font-script text-gradient-gold-warm">
                    {isSignUp ? 'Rejoignez-nous' : 'Bon retour'}
                </h2>
                <p className="text-gray-500 mt-1">{isSignUp ? 'Créez votre espace émotionnel.' : 'Connectez-vous à votre espace.'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="vous@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/50 border-gray-200 focus:border-[#BFA57C] focus:ring-[#BFA57C]"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                         className="bg-white/50 border-gray-200 focus:border-[#BFA57C] focus:ring-[#BFA57C]"
                    />
                </div>
                <Button type="submit" className="w-full shimmer-button bg-black text-white hover:bg-gray-800" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Créer mon compte" : "Se connecter")}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-gray-600 hover:text-black transition-colors" disabled={loading}>
                    {isSignUp ? 'Vous avez déjà un compte ? Connectez-vous.' : "Pas encore de compte ? Inscrivez-vous."}
                </button>
            </div>
        </div>
    );
};

export default AuthForm;