import { mongoClient } from '@/infrastructure/database/mongo/mongoClient.js';
import { Template } from '@/domain/entities/Template.js';
import { appLogger } from '@/shared/observability/logger/appLogger.js';

const sampleTemplates = [
  {
    name: "Modern Dashboard",
    description: "A sleek and modern dashboard template with responsive design, perfect for admin panels and analytics.",
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    category: "Dashboard"
  },
  {
    name: "E-commerce Landing",
    description: "Beautiful e-commerce landing page template with product showcase and modern design elements.",
    thumbnail_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
    category: "E-commerce"
  },
  {
    name: "Portfolio Website",
    description: "Clean and professional portfolio template for showcasing your work and skills.",
    thumbnail_url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=250&fit=crop",
    category: "Portfolio"
  },
  {
    name: "Blog Template",
    description: "Minimalist blog template with excellent typography and reading experience.",
    thumbnail_url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop",
    category: "Blog"
  },
  {
    name: "SaaS Landing Page",
    description: "Convert visitors into customers with this high-converting SaaS landing page template.",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    category: "SaaS"
  },
  {
    name: "Corporate Website",
    description: "Professional corporate website template suitable for businesses and enterprises.",
    thumbnail_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
    category: "Corporate"
  },
  {
    name: "Restaurant Menu",
    description: "Elegant restaurant website template with menu showcase and online ordering features.",
    thumbnail_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop",
    category: "Restaurant"
  },
  {
    name: "Mobile App Landing",
    description: "Showcase your mobile app with this modern and responsive landing page template.",
    thumbnail_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    category: "Mobile"
  },
  {
    name: "Photography Gallery",
    description: "Beautiful gallery template for photographers to showcase their portfolio.",
    thumbnail_url: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=250&fit=crop",
    category: "Photography"
  },
  {
    name: "Education Platform",
    description: "Complete education platform template with course listings and student dashboard.",
    thumbnail_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop",
    category: "Education"
  }
];

async function seedTemplates() {
  try {
    appLogger.info('Seeder', 'Connecting to database...');
    await mongoClient.connect();

    appLogger.info('Seeder', 'Clearing existing templates...');
    await Template.deleteMany({});

    appLogger.info('Seeder', 'Seeding sample templates...');
    const createdTemplates = await Template.insertMany(sampleTemplates);

    appLogger.info('Seeder', `Successfully seeded ${createdTemplates.length} templates`);
    
    // Log the created templates
    createdTemplates.forEach((template: any, index: number) => {
      appLogger.info('Seeder', `${index + 1}. ${template.name} (${template.category})`);
    });

    appLogger.info('Seeder', 'Seeding completed successfully!');
    
  } catch (error) {
    appLogger.error('Seeder', `Seeding failed: ${(error as Error).message}`);
    throw error;
  } finally {
    await mongoClient.disconnect();
    appLogger.info('Seeder', 'Disconnected from database');
  }
}

// Run the seeder
seedTemplates()
  .then(() => {
    console.log('✅ Template seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Template seeding failed:', error);
    process.exit(1);
  });
