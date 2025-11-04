import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const testimonials = [
  {
    name: 'Sophie M.',
    stone: 'Quartz Rose',
    message: 'Depuis que j\'ai découvert ma pierre, je me sens tellement plus en paix avec moi-même. Merci Milaura ! 💖',
    likes: 42
  },
  {
    name: 'Lucas D.',
    stone: 'Améthyste',
    message: 'L\'améthyste m\'aide vraiment à gérer mon stress quotidien. Je recommande à 100% !',
    likes: 38
  },
  {
    name: 'Emma L.',
    stone: 'Citrine',
    message: 'Ma bougie citrine est devenue mon rituel matinal préféré. L\'énergie est incroyable ! ✨',
    likes: 51
  }
];

const Community = () => {
  const [liked, setLiked] = useState({});

  const handleLike = (index) => {
    setLiked({ ...liked, [index]: !liked[index] });
    toast({
      title: liked[index] ? "💔 Like retiré" : "💝 Merci pour votre soutien !",
      description: "Votre interaction compte pour notre communauté",
    });
  };

  return (
    <section id="community" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-5xl font-bold text-gradient mb-4">Notre Communauté</h2>
          <p className="text-xl text-gray-700">Partagez votre expérience avec vos pierres</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect p-6 rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.stone}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{testimonial.message}</p>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(index)}
                  className={liked[index] ? 'text-pink-500' : ''}
                >
                  <Heart className={`w-5 h-5 mr-2 ${liked[index] ? 'fill-current' : ''}`} />
                  {testimonial.likes + (liked[index] ? 1 : 0)}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toast({
                    title: "💬 Commentaires",
                    description: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais vous pouvez la demander dans votre prochain prompt ! 🚀",
                  })}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Répondre
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => toast({
              title: "✍️ Partager votre histoire",
              description: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais vous pouvez la demander dans votre prochain prompt ! 🚀",
            })}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-6 text-lg rounded-full"
          >
            <Share2 className="w-6 h-6 mr-2" />
            Partager Mon Expérience
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Community;