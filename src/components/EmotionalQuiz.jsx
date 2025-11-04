import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';

const quizData = {
    profiles: {
        'Sérénité': { name: 'Bougie Sérénité', stone: 'Améthyste', scent: 'Thé blanc', phrase: 'Laisse le calme t’envahir, respire la paix intérieure.', productId: 'prod_bougie_serenite' },
        'Protection': { name: 'Bougie Protection', stone: 'Obsidienne noire', scent: 'Bois d’oud', phrase: 'Ton espace est sacré, ton énergie te protège.', productId: 'prod_bougie_protection' },
        'Élégance': { name: 'Bougie Élégance', stone: 'Quartz rose', scent: 'Ambre gris', phrase: 'Aime-toi assez pour danser avec la vie.', productId: 'prod_bougie_elegance' },
        'Joie': { name: 'Bougie Joie', stone: 'Aventurine verte', scent: 'Fleur d’oranger', phrase: 'Rayonne ta lumière, partage ton sourire au monde.', productId: 'prod_bougie_joie' },
        'Réconfort': { name: 'Bougie Réconfort', stone: 'Calcédoine bleue', scent: 'Néroli', phrase: 'Accueille la douceur, libère le poids du cœur.', productId: 'prod_bougie_reconfort' },
    },
    questions: [
        { q: "Comment te sens-tu ces derniers jours ?", o: [{ t: "Apaisé(e)", p: "Sérénité" }, { t: "Fatigué(e) mentalement", p: "Sérénité" }, { t: "Émotif(ve)", p: "Réconfort" }, { t: "Plein(e) d’énergie", p: "Joie" }] },
        { q: "Quelle émotion aimerais-tu équilibrer ?", o: [{ t: "Le stress", p: "Sérénité" }, { t: "Le manque de confiance", p: "Protection" }, { t: "La tristesse", p: "Réconfort" }, { t: "L’agitation intérieure", p: "Sérénité" }] },
        { q: "Quelle couleur t’attire aujourd’hui ?", o: [{ t: "Violet améthyste", p: "Sérénité" }, { t: "Rose tendre", p: "Élégance" }, { t: "Vert doux", p: "Joie" }, { t: "Noir profond", p: "Protection" }] },
        { q: "Quelle atmosphère te ressource le plus ?", o: [{ t: "Le calme d’une soirée d’hiver", p: "Réconfort" }, { t: "Le parfum d’un jardin fleuri", p: "Élégance" }, { t: "Le souffle d’une forêt", p: "Protection" }, { t: "Le mystère de la nuit", p: "Protection" }] },
        { q: "Quel mot résonne le plus avec ton énergie du moment ?", o: [{ t: "Protection", p: "Protection" }, { t: "Sérénité", p: "Sérénité" }, { t: "Réconfort", p: "Réconfort" }, { t: "Joie", p: "Joie" }] },
        { q: "Le moment de la journée où tu te sens le plus connecté à toi-même ?", o: [{ t: "Le matin", p: "Joie" }, { t: "Le coucher du soleil", p: "Élégance" }, { t: "La nuit", p: "Protection" }, { t: "Après une méditation", p: "Sérénité" }] },
        { q: "Si ta lumière intérieure était une flamme, elle serait…", o: [{ t: "Stable et rassurante", p: "Protection" }, { t: "Vive et passionnée", p: "Joie" }, { t: "Douce et apaisante", p: "Réconfort" }, { t: "Discrète mais constante", p: "Sérénité" }] },
    ]
};

const QuizIntro = ({ onStart }) => (
    <motion.div
        key="intro"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
        className="text-center flex flex-col items-center justify-center p-4 min-h-[50vh]"
    >
        <h2 className="text-3xl md:text-4xl font-script text-gradient-gold-warm mb-4">🌙 Bienvenue dans ton rituel intérieur.</h2>
        <p className="text-gray-600 max-w-lg mb-8">Laisse ton intuition te guider à travers quelques questions simples, et découvre la bougie qui reflète ton énergie du moment.</p>
        <motion.button
            onClick={onStart}
            className="btn-golden-animated !px-8 !py-4 !text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            Commencer le rituel
        </motion.button>
    </motion.div>
);

const QuizCompletion = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center p-4 min-h-[50vh]">
        <div className="relative mb-6">
            <Sparkles className="text-amber-400 h-20 w-20" />
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 bg-amber-300 rounded-full"
                    initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
                    animate={{ 
                        scale: [0, 1, 0], 
                        opacity: [0, 0.7, 0]
                    }}
                    transition={{
                        duration: Math.random() * 2 + 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: 'circOut'
                    }}
                    style={{
                        width: `${Math.random() * 8 + 4}px`,
                        height: `${Math.random() * 8 + 4}px`,
                        transform: `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 60 + 20}px)`
                    }}
                />
            ))}
        </div>
        <motion.h2 className="text-2xl md:text-3xl font-script text-gradient-gold-warm">
            ✨ Nous réunissons nos énergies pour révéler ta création unique…
        </motion.h2>
    </motion.div>
);

const EmotionalQuiz = ({ onComplete }) => {
    const [step, setStep] = useState('intro'); // 'intro', 'quiz', 'completing'
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState([]);

    const handleStart = () => setStep('quiz');

    const handleAnswer = (profile) => {
        const newAnswers = [...answers, profile];
        setAnswers(newAnswers);
        if (current < quizData.questions.length - 1) {
            setCurrent(current + 1);
        } else {
            finishQuiz(newAnswers);
        }
    };

    const finishQuiz = (finalAnswers) => {
        setStep('completing');
        setTimeout(() => {
            const counts = finalAnswers.reduce((acc, p) => { acc[p] = (acc[p] || 0) + 1; return acc; }, {});
            
            // Add 'Élégance' to counts if not present, to match it with 'Amour' type answers.
            if (finalAnswers.includes('Élégance')) {
                counts['Élégance'] = (counts['Élégance'] || 0);
            } else {
                 counts['Élégance'] = 0;
            }

            // Find the most frequent profile
            let dominantProfile = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            
            // If there's a tie, we can have a priority list or a fallback. For now, first one wins.
            // A more sophisticated logic could be added here if needed.
             if (!dominantProfile) { // Fallback in case of empty answers
                dominantProfile = 'Sérénité';
            }


            const result = {
                profileName: dominantProfile,
                ...quizData.profiles[dominantProfile],
                emotionalWeather: {
                    stress: (counts['Sérénité'] || 0) / finalAnswers.length * 100,
                    confiance: (counts['Protection'] || 0) / finalAnswers.length * 100,
                    joie: (counts['Joie'] || 0) / finalAnswers.length * 100,
                    equilibre: (counts['Élégance'] || 0) / finalAnswers.length * 100,
                },
                timestamp: new Date().toISOString(),
            };
            onComplete(result);
        }, 3000);
    };

    const progress = ((current + 1) / quizData.questions.length) * 100;

    if (step === 'intro') {
        return <QuizIntro onStart={handleStart} />;
    }
    if (step === 'completing') {
        return <QuizCompletion />;
    }

    return (
        <div className="container mx-auto max-w-3xl p-4">
            <motion.div
                className="bg-[#fdfaf5] border border-amber-200/50 rounded-3xl p-1 shadow-2xl shadow-amber-900/10"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c7b28a\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                }}
            >
                <div className="bg-transparent rounded-[22px] p-6 md:p-10 relative">
                    <div className="mb-8 text-center">
                        <div className="relative w-20 h-20 mx-auto mb-2">
                            <Flame className="absolute inset-0 w-full h-full text-amber-200" />
                            <motion.div
                                className="absolute inset-0 w-full h-full"
                                style={{
                                    clipPath: `inset(${100 - progress}% 0 0 0)`,
                                }}
                            >
                                <Flame className="w-full h-full text-amber-400" />
                            </motion.div>
                        </div>
                         <p className="text-center text-sm text-gray-500">Question {current + 1} sur {quizData.questions.length}</p>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6, type: 'spring', damping: 20, stiffness: 100 }}
                        >
                            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-gray-800">{quizData.questions[current].q}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {quizData.questions[current].o.map((option, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => handleAnswer(option.p)}
                                        className="w-full text-center p-5 rounded-2xl transition-all border-2 border-amber-200/50 bg-white/30 hover:border-amber-400 hover:bg-amber-50/50"
                                        whileHover={{ scale: 1.03, boxShadow: '0px 5px 20px rgba(199, 178, 138, 0.2)' }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="text-lg text-gray-700">{option.t}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default EmotionalQuiz;