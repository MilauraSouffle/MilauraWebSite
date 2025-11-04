import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { articles } from '@/data/articles';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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

const ArticlePage = () => {
  const { slug } = useParams();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return <Navigate to="/conseils-energie" />;
  }

  const metaDescription = article.excerpt || article.content.replace(/<[^>]+>/g, '').substring(0, 160);

  return (
    <>
      <Seo
        title={article.title}
        description={metaDescription}
        canonical={`https://milaura.fr/conseils-energie/${slug}`}
        ogType="article"
        ogImage="https://milaura.fr/assets/og-default.jpg"
      />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="pt-12 pb-20"
      >
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button asChild variant="link" className="text-gray-600 hover:text-black p-0">
              <Link to="/conseils-energie">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au blog
              </Link>
            </Button>
          </motion.div>

          <article>
            <motion.div 
              className="overflow-hidden rounded-2xl mb-12 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <img 
                class="w-full h-auto md:h-[400px] object-cover" 
                alt={article.title}
               src="https://images.unsplash.com/photo-1623644770830-3f0f6d2d2aed" />
            </motion.div>

            <motion.div 
              className="prose lg:prose-xl max-w-none mx-auto text-gray-800 prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-strong:text-gray-800 prose-a:text-amber-600 hover:prose-a:text-amber-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>

          <motion.div 
            className="text-center mt-20 pt-12 border-t border-amber-200/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Cet article vous a inspiré ?</h3>
            <p className="text-gray-600 mb-6">Explorez nos collections et trouvez la création qui résonne avec votre énergie.</p>
            <Button asChild size="lg" className="btn-golden-animated">
              <Link to="/boutique">
                Découvrir nos créations
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default ArticlePage;