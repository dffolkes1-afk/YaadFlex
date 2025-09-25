// Luxury YaadFlex Fashion Data Seeder
import { db } from './db';
import { 
  yaadflexCategories, 
  yaadflexProducts,
  yaadflexSuppliers 
} from '../shared/schema';

export async function seedYaadFlexLuxuryData() {
  console.log('🌟 Seeding YaadFlex Luxury Fashion Data...');
  
  try {
    // Create luxury suppliers first
    const suppliers = await db.insert(yaadflexSuppliers).values([
      {
        name: 'YaadFlex Premium Manufacturing',
        contactEmail: 'premium@yaadflex.com',
        contactPhone: '+1-876-555-LUXURY',
        address: 'Kingston, Jamaica',
        country: 'Jamaica',
        isActive: true
      },
      {
        name: 'YaadFlex Artisan Collective',
        contactEmail: 'artisan@yaadflex.com',
        contactPhone: '+1-876-555-CRAFT',
        address: 'Blue Mountains, Jamaica',
        country: 'Jamaica',
        isActive: true
      },
      {
        name: 'YaadFlex Blue Mountain Coffee Co.',
        contactEmail: 'coffee@yaadflex.com',
        contactPhone: '+1-876-555-BEANS',
        address: 'Blue Mountains, Jamaica',
        country: 'Jamaica',
        isActive: true
      }
    ]).returning();

    // Create luxury categories
    const categories = await db.insert(yaadflexCategories).values([
      {
        name: 'YF Shirts',
        displayName: 'YaadFlex Luxury Shirts',
        description: 'Premium Caribbean-inspired designer shirts with Gucci-style sophistication',
        categoryType: 'clothing',
        iconUrl: '/api/yaadflex/images/category-shirts.jpg',
        sortOrder: 1
      },
      {
        name: 'YF Shoes',
        displayName: 'YaadFlex Designer Shoes',
        description: 'Handcrafted luxury footwear blending Caribbean flair with Italian elegance',
        categoryType: 'clothing',
        iconUrl: '/api/yaadflex/images/category-shoes.jpg',
        sortOrder: 2
      },
      {
        name: 'YF Coffee',
        displayName: 'YaadFlex Premium Coffee',
        description: 'Exclusive Blue Mountain coffee blends in luxury packaging',
        categoryType: 'beverages',
        iconUrl: '/api/yaadflex/images/category-coffee.jpg',
        sortOrder: 3
      },
      {
        name: 'YF Accessories',
        displayName: 'YaadFlex Luxury Accessories',
        description: 'Exquisite jewelry, watches, and accessories with Caribbean soul',
        categoryType: 'accessories',
        iconUrl: '/api/yaadflex/images/category-accessories.jpg',
        sortOrder: 4
      }
    ]).returning();

    // Create luxury products - get category IDs from inserted categories
    const categoryIds = {
      shirts: categories.find(c => c.name === 'YF Shirts')?.id!,
      shoes: categories.find(c => c.name === 'YF Shoes')?.id!,
      coffee: categories.find(c => c.name === 'YF Coffee')?.id!,
      accessories: categories.find(c => c.name === 'YF Accessories')?.id!,
    };
    
    const supplierIds = {
      premium: suppliers.find(s => s.name === 'YaadFlex Premium Manufacturing')?.id!,
      artisan: suppliers.find(s => s.name === 'YaadFlex Artisan Collective')?.id!,
      coffee: suppliers.find(s => s.name === 'YaadFlex Blue Mountain Coffee Co.')?.id!,
    };

    const products = await db.insert(yaadflexProducts).values([
      // YF Luxury Shirts
      {
        name: 'Royal Emerald Silk Shirt',
        description: 'Luxurious silk shirt in signature YaadFlex emerald with gold thread embroidery. Inspired by Caribbean royalty with modern sophistication.',
        basePrice: 299.99,
        currency: 'USD',
        categoryId: categoryIds.shirts,
        supplierId: supplierIds.premium,
        sku: 'YF-SHIRT-EMERALD-001',
        brand: 'YaadFlex',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Emerald Green', 'Gold', 'Royal Blue', 'Rose Gold'],
        materials: ['Premium Mulberry Silk'],
        images: ['/api/yaadflex/images/royal-emerald-shirt-1.jpg', '/api/yaadflex/images/royal-emerald-shirt-2.jpg'],
        isFeatured: true,
        stockQuantity: 25,
        shippingWeight: 0.3,
        shippingDimensions: { length: 30, width: 25, height: 2 },
        tags: ['luxury', 'premium', 'caribbean', 'silk', 'emerald']
      },
      {
        name: 'Caribbean Sunset Linen Shirt',
        description: 'Breathable luxury linen shirt featuring hand-painted sunset patterns. Perfect for tropical elegance with YaadFlex signature style.',
        basePrice: 199.99,
        currency: 'USD',
        categoryId: categoryIds.shirts,
        supplierId: supplierIds.premium,
        sku: 'YF-SHIRT-SUNSET-002',
        brand: 'YaadFlex',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Sunset Orange', 'Palm Green', 'Ocean Blue'],
        materials: ['Belgian Linen'],
        images: ['/api/yaadflex/images/caribbean-sunset-shirt-1.jpg'],
        isFeatured: true,
        stockQuantity: 18,
        shippingWeight: 0.25,
        shippingDimensions: { length: 28, width: 24, height: 2 },
        tags: ['luxury', 'premium', 'caribbean', 'linen', 'sunset']
      },
      
      // YF Designer Shoes
      {
        name: 'Gold Rush Luxury Loafers',
        description: 'Handcrafted Italian leather loafers with 24k gold hardware. Caribbean sophistication meets European craftsmanship.',
        basePrice: 599.99,
        currency: 'USD',
        categoryId: categoryIds.shoes,
        supplierId: supplierIds.artisan,
        sku: 'YF-SHOES-LOAFER-001',
        brand: 'YaadFlex',
        sizes: ['6', '7', '8', '9', '10', '11', '12'],
        colors: ['Cognac Brown', 'Midnight Black', 'Emerald Green'],
        materials: ['Italian Calfskin Leather'],
        images: ['/api/yaadflex/images/gold-loafers-1.jpg', '/api/yaadflex/images/gold-loafers-2.jpg'],
        isFeatured: true,
        stockQuantity: 12,
        shippingWeight: 0.8,
        shippingDimensions: { length: 32, width: 12, height: 10 },
        tags: ['luxury', 'premium', 'caribbean', 'leather', 'gold']
      },
      {
        name: 'Emerald Empress Heels',
        description: 'Stunning emerald green heels with Swarovski crystal details. Designed for the modern Caribbean queen who demands luxury.',
        basePrice: 499.99,
        currency: 'USD',
        categoryId: categoryIds.shoes,
        supplierId: supplierIds.artisan,
        sku: 'YF-SHOES-HEELS-002',
        brand: 'YaadFlex',
        sizes: ['5', '6', '7', '8', '9', '10'],
        colors: ['Emerald Green', 'Rose Gold', 'Platinum Silver'],
        materials: ['Satin', 'Swarovski Crystals'],
        images: ['/api/yaadflex/images/emerald-heels-1.jpg'],
        isFeatured: false,
        stockQuantity: 8,
        shippingWeight: 0.6,
        shippingDimensions: { length: 28, width: 10, height: 12 },
        tags: ['luxury', 'premium', 'caribbean', 'heels', 'emerald']
      },

      // YF Premium Coffee
      {
        name: 'Royal Blue Mountain Blend',
        description: 'Exclusive blend of the finest Blue Mountain coffee beans, packaged in luxury gold-lined containers. Limited edition YaadFlex signature roast.',
        basePrice: 149.99,
        currency: 'USD',
        categoryId: categoryIds.coffee,
        supplierId: supplierIds.coffee,
        sku: 'YF-COFFEE-ROYAL-001',
        brand: 'YaadFlex',
        sizes: ['250g', '500g', '1kg'],
        colors: ['Gold Package', 'Emerald Package', 'Platinum Package'],
        materials: ['Premium Blue Mountain Coffee Beans'],
        images: ['/api/yaadflex/images/royal-coffee-1.jpg', '/api/yaadflex/images/royal-coffee-2.jpg'],
        isFeatured: true,
        stockQuantity: 50,
        shippingWeight: 0.5,
        shippingDimensions: { length: 15, width: 15, height: 20 },
        tags: ['luxury', 'premium', 'caribbean', 'coffee', 'blue-mountain']
      },
      {
        name: 'Luxury Coffee Connoisseur Set',
        description: 'Premium gift set with Blue Mountain coffee, handcrafted ceramic cups, and gold-plated spoons. Perfect for the sophisticated coffee lover.',
        basePrice: 299.99,
        currency: 'USD',
        categoryId: categoryIds.coffee,
        supplierId: supplierIds.coffee,
        sku: 'YF-COFFEE-GIFT-002',
        brand: 'YaadFlex',
        sizes: ['Gift Set'],
        colors: ['Emerald & Gold', 'Royal Blue & Silver'],
        materials: ['Coffee', 'Ceramic', 'Gold Plate'],
        images: ['/api/yaadflex/images/coffee-gift-set-1.jpg'],
        isFeatured: false,
        stockQuantity: 20,
        shippingWeight: 1.2,
        shippingDimensions: { length: 35, width: 25, height: 15 },
        tags: ['luxury', 'premium', 'caribbean', 'coffee', 'gift-set']
      },

      // YF Luxury Accessories
      {
        name: 'Emerald Elite Timepiece',
        description: 'Swiss-made luxury watch with emerald-studded face and 18k gold case. Caribbean elegance meets Swiss precision.',
        basePrice: 2999.99,
        currency: 'USD',
        categoryId: categoryIds.accessories,
        supplierId: supplierIds.artisan,
        sku: 'YF-WATCH-EMERALD-001',
        brand: 'YaadFlex',
        sizes: ['40mm', '42mm'],
        colors: ['Gold & Emerald', 'Platinum & Diamond'],
        materials: ['18k Gold', 'Swiss Movement', 'Emeralds'],
        images: ['/api/yaadflex/images/emerald-watch-1.jpg', '/api/yaadflex/images/emerald-watch-2.jpg'],
        isFeatured: true,
        stockQuantity: 5,
        shippingWeight: 0.15,
        shippingDimensions: { length: 4.5, width: 4.5, height: 1.2 },
        tags: ['luxury', 'premium', 'caribbean', 'watch', 'emerald']
      },
      {
        name: 'Caribbean Crown Necklace',
        description: 'Handcrafted gold necklace featuring emeralds and diamonds in a crown design. Celebrates Caribbean heritage with royal luxury.',
        basePrice: 1599.99,
        currency: 'USD',
        categoryId: categoryIds.accessories,
        supplierId: supplierIds.artisan,
        sku: 'YF-JEWELRY-CROWN-002',
        brand: 'YaadFlex',
        sizes: ['18 inch', '20 inch', '22 inch'],
        colors: ['Gold & Emerald', 'Rose Gold & Ruby'],
        materials: ['14k Gold', 'Emeralds', 'Diamonds'],
        images: ['/api/yaadflex/images/crown-necklace-1.jpg'],
        isFeatured: true,
        stockQuantity: 10,
        shippingWeight: 0.05,
        shippingDimensions: { length: 50, width: 2, height: 0.5 },
        tags: ['luxury', 'premium', 'caribbean', 'jewelry', 'crown']
      }
    ]).returning();

    console.log(`✨ Successfully seeded ${suppliers.length} suppliers, ${categories.length} categories, and ${products.length} luxury products!`);
    console.log('🎯 YaadFlex Luxury Fashion Line is ready to compete with the finest brands!');
    
    return { suppliers, categories, products };
  } catch (error) {
    console.error('❌ Error seeding YaadFlex luxury data:', error);
    throw error;
  }
}