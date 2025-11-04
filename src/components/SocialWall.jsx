import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    name: 'Sophie M.',
    rating: 5,
    text: "La bougie Améthyste a transformé mes soirées. Une atmosphère de pure détente. Merci #MilauraMagie",
    productImage: "https://i.imgur.com/II767Bq.png",
    productAlt: "Bougie Améthyste allumée"
  },
  {
    name: 'Lucas D.',
    rating: 5,
    text: "Mon bracelet en Oeil de Tigre ne me quitte plus. Je ressens une vraie force intérieure.",
    productImage: "https://i.imgur.com/Tl4SdoO.png",
    productAlt: "Bracelet en Oeil de Tigre"
  },
  {
    name: 'Emma L.',
    rating: 4,
    text: "J'adore ma pierre de Citrine ! Elle apporte tellement de positivité à mon espace de travail.",
    productImage: "https://i.imgur.com/BqDuBUu.png",
    productAlt: "Pierre de Citrine brute"
  },
];

const StarRating = ({ rating }) => (
  <div className="flex text-amber-400">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? 'fill-current' : ''}`} />
    ))}
  </div>
);

const SocialWall = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#FBF9F4] to-[#F5EFE6] -mt-16 md:-mt-24">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Users className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-5xl font-script font-bold text-gradient-gold-warm mb-4">
            Notre communauté raconte
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Parce que chaque bougie que nous allumons éclaire une histoire. Partagez la vôtre sur Instagram avec <a href="https://www.instagram.com/explore/tags/milauraMagie/" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-600 hover:text-amber-700 transition-colors">#MilauraMagie</a> et apparaissez peut-être ici !
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg overflow-hidden p-6 flex flex-col items-center text-center golden-frame-light"
              variants={itemVariants}
            >
              <div className="relative w-32 h-32 mb-4">
                <img src={testimonial.productImage} alt={testimonial.productAlt} className="w-full h-full object-cover rounded-2xl shadow-md" />
                 <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-purple-500 to-pink-500 text-white p-2 rounded-full shadow-lg">
                  <Instagram className="w-5 h-5"/>
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-800">{testimonial.name}</h3>
              <div className="my-2">
                <StarRating rating={testimonial.rating} />
              </div>
              <p className="text-gray-600 italic text-sm">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <a href="https://www.instagram.com/explore/tags/milauraMagie/" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="btn-golden-animated !px-8 !py-6 !text-lg">
              Voir plus sur Instagram
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialWall;