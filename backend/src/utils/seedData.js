import { db, initializeDatabase } from '../config/database.js';

function seedLanes() {
  const lanes = [
    ['Toronto', 'ON', 'M5H 2N2', 'Montreal', 'QC', 'H3B 4W8', 520.00, 541, 1],
    ['Vancouver', 'BC', 'V6B 1A1', 'Calgary', 'AB', 'T2P 2M5', 680.00, 972, 2],
    ['Montreal', 'QC', 'H3B 4W8', 'Ottawa', 'ON', 'K1P 1J1', 380.00, 199, 1],
    ['Calgary', 'AB', 'T2P 2M5', 'Edmonton', 'AB', 'T5J 2R7', 420.00, 299, 1],
    ['Toronto', 'ON', 'M5H 2N2', 'Ottawa', 'ON', 'K1P 1J1', 450.00, 450, 1],
    ['Vancouver', 'BC', 'V6B 1A1', 'Victoria', 'BC', 'V8W 1P6', 280.00, 115, 1],
    ['Winnipeg', 'MB', 'R3C 3H8', 'Regina', 'SK', 'S4P 3Y2', 480.00, 571, 2],
    ['Halifax', 'NS', 'B3J 1S9', 'Moncton', 'NB', 'E1C 8R9', 340.00, 262, 1],
    ['Quebec City', 'QC', 'G1R 4P5', 'Montreal', 'QC', 'H3B 4W8', 320.00, 253, 1],
    ['Toronto', 'ON', 'M5H 2N2', 'Windsor', 'ON', 'N9A 6S3', 480.00, 370, 1],
    ['Edmonton', 'AB', 'T5J 2R7', 'Saskatoon', 'SK', 'S7K 1M3', 520.00, 525, 2],
    ['Vancouver', 'BC', 'V6B 1A1', 'Kelowna', 'BC', 'V1Y 1Z4', 450.00, 395, 1],
    ['Ottawa', 'ON', 'K1P 1J1', 'Kingston', 'ON', 'K7L 2Z5', 240.00, 180, 1],
    ['Calgary', 'AB', 'T2P 2M5', 'Vancouver', 'BC', 'V6B 1A1', 680.00, 972, 2],
    ['Montreal', 'QC', 'H3B 4W8', 'Toronto', 'ON', 'M5H 2N2', 520.00, 541, 1],
    ['Mississauga', 'ON', 'L5B 3C1', 'Hamilton', 'ON', 'L8P 4W9', 190.00, 45, 1],
    ['Surrey', 'BC', 'V3T 4W4', 'Burnaby', 'BC', 'V5H 4M1', 150.00, 25, 1],
    ['London', 'ON', 'N6A 5C1', 'Kitchener', 'ON', 'N2G 1C5', 180.00, 95, 1],
    ['Quebec City', 'QC', 'G1R 4P5', 'Sherbrooke', 'QC', 'J1H 1Z1', 220.00, 155, 1],
    ['St. John\'s', 'NL', 'A1C 5M3', 'Corner Brook', 'NL', 'A2H 6J8', 380.00, 684, 2]
  ];

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO lanes 
    (origin_city, origin_province, origin_postal, destination_city, destination_province, 
     destination_postal, base_rate, distance_km, transit_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((lanes) => {
    for (const lane of lanes) {
      stmt.run(lane);
    }
  });

  insertMany(lanes);
  console.log(`✅ Seeded ${lanes.length} lanes`);
}

function seedEquipment() {
  const equipment = [
    ['dry_van', 1.0],
    ['reefer', 1.3],
    ['flatbed', 1.15]
  ];

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO equipment_types (equipment_type, multiplier)
    VALUES (?, ?)
  `);

  for (const eq of equipment) {
    stmt.run(eq);
  }

  console.log(`✅ Seeded ${equipment.length} equipment types`);
}

// Main execution
console.log('🌱 Starting database seed...');

// Initialize database tables first
initializeDatabase();

// Then seed data
seedLanes();
seedEquipment();

console.log('✅ Database seeding completed!');

// Close database connection
db.close();