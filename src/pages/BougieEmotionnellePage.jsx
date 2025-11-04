import React from 'react';
import EmotionalDashboardPage from './EmotionalDashboardPage';
import Seo from "@/components/Seo";

const BougieEmotionnellePage = () => {
    return (
        <>
            <Seo
              title="Votre bougie émotionnelle – Quiz"
              description="Faites le quiz et découvrez la bougie et la pierre qui résonnent avec votre énergie."
              canonical="https://milaura.fr/bougie-emotionnelle"
            />
            <EmotionalDashboardPage />
        </>
    );
};

export default BougieEmotionnellePage;