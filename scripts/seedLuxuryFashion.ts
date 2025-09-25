#!/usr/bin/env tsx
import { seedYaadFlexLuxuryData } from '../server/seedYaadFlexData';

async function main() {
  try {
    console.log('🌟 Starting YaadFlex Luxury Fashion Data Seeding...');
    await seedYaadFlexLuxuryData();
    console.log('✅ YaadFlex Luxury Fashion Line successfully populated!');
    console.log('🎯 Your premium collection is ready to outshine Gucci!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed luxury fashion data:', error);
    process.exit(1);
  }
}

main();