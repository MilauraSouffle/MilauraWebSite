import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

const QuizCTA = () => {
  return (
    <section className="py-20 px-4 bg-[#F5F1E9]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="golden-frame"
        >
          <div className="bg-[#FBF9F4] rounded-2xl p-12 text-center">
            <Sparkles className="w-16 h-16 text-gradient mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">
              Votre âme a un message pour vous.
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              Répondez à quelques questions intuitives et laissez-nous vous révéler la pierre qui résonne avec votre énergie du moment.
            </p>
            <Link to="/profil?quiz=true">
              <Button size="lg" className="bg-black text-white rounded-full px-8 py-6 text-lg">
                Commencer le voyage <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuizCTA;