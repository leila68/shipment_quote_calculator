import { initializeDatabase, getDatabase } from '../config/database.js';

const seedData = () => {
  console.log('🌱 Starting database seed...');
  
  initializeDatabase();
  const db = getDatabase();

  try {
    // Check if already seeded - DON'T delete existing data!
    const laneCount = db.prepare('SELECT COUNT(*) as count FROM lanes').get();
    const equipmentCount = db.prepare('SELECT COUNT(*) as count FROM equipment_types').get();
    
    if (laneCount.count > 0 && equipmentCount.count > 0) {
      console.log(`✅ Database already seeded (${laneCount.count} lanes, ${equipmentCount.count} equipment types found)`);
      console.log('   Skipping seed to preserve existing data...');
      return; // EXIT WITHOUT DELETING ANYTHING
    }

    console.log('📝 Seeding fresh database...');

    // Only seed if database is empty (no DELETE statements!)
    
    // Insert lanes
    const laneStmt = db.prepare(`
      INSERT INTO lanes (origin_city, origin_province, origin_postal, destination_city, destination_province, destination_postal, base_rate, distance_km, transit_days)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const lanes = [
      ['Toronto', 'ON', 'M5H 2N2', 'Montreal', 'QC', 'H3B 4W8', 520, 541, 1],
      ['Toronto', 'ON', 'M5H 2N2', 'Vancouver', 'BC', 'V6B 2W9', 3500, 4400, 5],
      ['Montreal', 'QC', 'H3B 4W8', 'Toronto', 'ON', 'M5H 2N2', 520, 541, 1],
      ['Vancouver', 'BC', 'V6B 2W9', 'Calgary', 'AB', 'T2P 2M5', 1200, 1000, 2],
      ['Calgary', 'AB', 'T2P 2M5', 'Edmonton', 'AB', 'T5J 2R7', 450, 300, 1],
      ['Toronto', 'ON', 'M5H 2N2', 'Ottawa', 'ON', 'K1P 1J1', 380, 450, 1],
      ['Montreal', 'QC', 'H3B 4W8', 'Quebec City', 'QC', 'G1R 4S9', 320, 250, 1],
      ['Vancouver', 'BC', 'V6B 2W9', 'Toronto', 'ON', 'M5H 2N2', 3500, 4400, 5],
    ];

    const insertLanes = db.transaction((lanes) => {
      for (const lane of lanes) {
        laneStmt.run(...lane);
      }
    });

    insertLanes(lanes);
    console.log(`✅ Inserted ${lanes.length} lanes`);

    // Insert equipment types
    const equipmentStmt = db.prepare(`
      INSERT INTO equipment_types (equipment_type, multiplier)
      VALUES (?, ?)
    `);

    const equipmentTypes = [
      ['dry_van', 1.0],
      ['reefer', 1.3],
      ['flatbed', 1.15],
    ];

    const insertEquipment = db.transaction((types) => {
      for (const type of types) {
        equipmentStmt.run(...type);
      }
    });

    insertEquipment(equipmentTypes);
    console.log(`✅ Inserted ${equipmentTypes.length} equipment types`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData();
}

export default seedData;