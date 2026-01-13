import { initializeDatabase, getDatabase } from '../config/database.js';

/**
 * Seed the database with initial data
 */
const seedData = async () => {
  console.log('🌱 Starting database seed...');

  try {
    // Initialize database connection and schema
    await initializeDatabase();
    const pool = getDatabase();

    // Check if already seeded - DON'T delete existing data!
    const laneCountResult = await pool.query('SELECT COUNT(*) as count FROM lanes');
    const equipmentCountResult = await pool.query('SELECT COUNT(*) as count FROM equipment_types');

    const laneCount = parseInt(laneCountResult.rows[0].count);
    const equipmentCount = parseInt(equipmentCountResult.rows[0].count);

    if (laneCount > 0 && equipmentCount > 0) {
      console.log(`✅ Database already seeded (${laneCount} lanes, ${equipmentCount} equipment types found)`);
      console.log('   Skipping seed to preserve existing data...');
      return; // EXIT WITHOUT DELETING ANYTHING
    }

    console.log('📝 Seeding fresh database...');

    // Only seed if database is empty (no DELETE statements!)

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert lanes
      const laneQuery = `
        INSERT INTO lanes (origin_city, origin_province, origin_postal, destination_city, destination_province, destination_postal, base_rate, distance_km, transit_days)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;

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

      for (const lane of lanes) {
        await client.query(laneQuery, lane);
      }
      console.log(`✅ Inserted ${lanes.length} lanes`);

      // Insert equipment types
      const equipmentQuery = `
        INSERT INTO equipment_types (equipment_type, multiplier)
        VALUES ($1, $2)
      `;

      const equipmentTypes = [
        ['dry_van', 1.0],
        ['reefer', 1.3],
        ['flatbed', 1.15],
      ];

      for (const type of equipmentTypes) {
        await client.query(equipmentQuery, type);
      }
      console.log(`✅ Inserted ${equipmentTypes.length} equipment types`);

      // Commit transaction
      await client.query('COMMIT');
      console.log('🎉 Database seeding completed successfully!');

    } catch (error) {
      // Rollback on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData()
    .then(() => {
      console.log('✅ Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed script failed:', error);
      process.exit(1);
    });
}

export default seedData;
