
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const TestimonialCard: React.FC<{ quote: string; name: string; location: string; image: string }> = ({ quote, name, location, image }) => (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200 h-full flex flex-col">
        <p className="text-gray-700 italic flex-grow">"{quote}"</p>
        <div className="flex items-center mt-6">
            <img className="w-12 h-12 rounded-full object-cover mr-4" src={image} alt={name} />
            <div>
                <p className="font-bold text-gray-900">{name}</p>
                <p className="text-sm text-gray-600">{location}</p>
            </div>
        </div>
    </div>
);


const Testimonials: React.FC = () => {
    const { t } = useTranslation();
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('testimonials_title')}</h2>
                    <p className="text-lg text-gray-600 mt-2">{t('testimonials_subtitle')}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TestimonialCard 
                        quote={t('testimonial1_quote')}
                        name={t('testimonial1_name')}
                        location={t('testimonial1_location')}
                        image="https://xsgames.co/randomusers/assets/avatars/female/74.jpg"
                    />
                    <TestimonialCard 
                        quote={t('testimonial2_quote')}
                        name={t('testimonial2_name')}
                        location={t('testimonial2_location')}
                        image="https://xsgames.co/randomusers/assets/avatars/male/74.jpg"
                    />
                    <TestimonialCard 
                        quote={t('testimonial3_quote')}
                        name={t('testimonial3_name')}
                        location={t('testimonial3_location')}
                        image="https://xsgames.co/randomusers/assets/avatars/female/56.jpg"
                    />
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
