import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.455-11.13-8.166l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const AuthForm = () => {
    const { signIn, signUp, signInWithGoogle, loading } = useAuth();
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

    const handleGoogleSignIn = async () => {
        await signInWithGoogle();
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

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#FBF9F4] px-2 text-gray-500">Ou</span>
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                onClick={handleGoogleSignIn}
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <GoogleIcon />
                )}
                <span className="ml-2">Continuer avec Google</span>
            </Button>

            <div className="mt-6 text-center">
                <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-gray-600 hover:text-black transition-colors" disabled={loading}>
                    {isSignUp ? 'Vous avez déjà un compte ? Connectez-vous.' : "Pas encore de compte ? Inscrivez-vous."}
                </button>
            </div>
        </div>
    );
};

export default AuthForm;