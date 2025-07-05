import { motion } from 'framer-motion';

interface SectionWrapperProps {
  id: string;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animationDelay?: number;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  title,
  eyebrow,
  subtitle,
  children,
  className = '',
  containerClassName = '',
  animationDelay = 0
}) => {
  const sectionVariants = {
    hidden: { 
      opacity: 0,
      y: 60,
    },
    visible: { 
      opacity: 1,
      y: 0,
    }
  };

  const titleVariants = {
    hidden: { 
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
    }
  };

  const contentVariants = {
    hidden: { 
      opacity: 0,
      y: 40
    },
    visible: { 
      opacity: 1,
      y: 0,
    }
  };

  return (
    <motion.section 
      id={id} 
      className={`py-16 section-padding ${className}`}
      initial="hidden"
      animate="visible"
      whileInView="visible"
      viewport={{ 
        once: true, 
        margin: "-50%",
        amount: 0.1
      }}
      variants={sectionVariants}
      transition={{
        duration: 0.8,
        delay: animationDelay,
        ease: "easeOut",
        staggerChildren: 0.1,
      }}
    >
      <div className={`container-max ${containerClassName}`}>
        {title && (
          <div className="text-center mb-12">
            {eyebrow && (
              <motion.p
                className="eyebrow mb-3"
                variants={titleVariants}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {eyebrow}
              </motion.p>
            )}
            <motion.h2
              className="font-display text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block"
              variants={titleVariants}
              transition={{
                duration: 0.6,
                ease: "easeOut"
              }}
            >
              {title}
              <motion.div
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.h2>
            {subtitle && (
              <motion.p
                className="text-neutral-600 text-lg max-w-2xl mx-auto mt-6"
                variants={titleVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
        <motion.div 
          variants={contentVariants}
          transition={{
            duration: 0.7,
            ease: "easeOut"
          }}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default SectionWrapper;