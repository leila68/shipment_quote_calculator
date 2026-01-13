# PostgreSQL Setup Guide

This guide will help you set up PostgreSQL for the Shipment Quote Calculator application.

## Prerequisites

- PostgreSQL 12+ installed on your system
- Node.js 16+ and npm

## Installation Steps

### 1. Install PostgreSQL

#### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
Download and install from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

### 2. Create Database and User

Connect to PostgreSQL as the postgres user:

```bash
# macOS/Linux
psql postgres

# Windows (using psql in Command Prompt)
psql -U postgres
```

Run the following SQL commands:

```sql
-- Create database
CREATE DATABASE shipment_quotes;

-- Create user (optional - you can use the default postgres user)
CREATE USER shipment_admin WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE shipment_quotes TO shipment_admin;

-- Connect to the database
\c shipment_quotes

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO shipment_admin;

-- Exit psql
\q
```

### 3. Configure Environment Variables

Update the `backend/.env` file with your PostgreSQL credentials:

```env
PORT=5000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shipment_quotes
DB_USER=postgres
DB_PASSWORD=your_password_here
```

**Important:** Never commit your `.env` file to version control. Use `.env.example` as a template.

### 4. Install Dependencies

```bash
cd backend
npm install
```

### 5. Run Database Migrations and Seed Data

The application will automatically:
- Create the database schema on first run
- Seed initial data (lanes and equipment types)

```bash
npm run seed
```

Or start the server (which will run migrations and seeds automatically):

```bash
npm run dev
```

### 6. Verify Setup

Check if the database is properly set up:

```bash
psql -U postgres -d shipment_quotes -c "\dt"
```

You should see three tables:
- `lanes`
- `equipment_types`
- `quotes`

Check the data:

```bash
psql -U postgres -d shipment_quotes -c "SELECT COUNT(*) FROM lanes;"
psql -U postgres -d shipment_quotes -c "SELECT COUNT(*) FROM equipment_types;"
```

## Database Schema

### Tables

#### `lanes`
Stores shipping routes with origin and destination information.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| origin_city | VARCHAR(100) | Origin city name |
| origin_province | VARCHAR(2) | Origin province code |
| origin_postal | VARCHAR(10) | Origin postal code |
| destination_city | VARCHAR(100) | Destination city |
| destination_province | VARCHAR(2) | Destination province |
| destination_postal | VARCHAR(10) | Destination postal |
| base_rate | NUMERIC(10,2) | Base shipping rate |
| distance_km | NUMERIC(8,2) | Distance in kilometers |
| transit_days | INTEGER | Expected transit days |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### `equipment_types`
Equipment types with pricing multipliers.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| equipment_type | VARCHAR(50) | Equipment type name |
| multiplier | NUMERIC(4,2) | Price multiplier |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### `quotes`
Generated shipping quotes with full details.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| lane_id | INTEGER | Foreign key to lanes |
| equipment_type | VARCHAR(50) | Selected equipment |
| total_weight | NUMERIC(10,2) | Shipment weight |
| pickup_date | DATE | Scheduled pickup |
| base_rate | NUMERIC(10,2) | Base rate |
| equipment_multiplier | NUMERIC(4,2) | Equipment multiplier |
| weight_surcharge | NUMERIC(10,2) | Weight surcharge |
| fuel_surcharge | NUMERIC(10,2) | Fuel surcharge |
| total_quote | NUMERIC(10,2) | Total quote amount |
| status | quote_status | created, sent, accepted |
| liftgate_service | BOOLEAN | Liftgate required |
| appointment_delivery | BOOLEAN | Appointment delivery |
| residential_delivery | BOOLEAN | Residential delivery |
| accessories_total | NUMERIC(10,2) | Accessories total |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### Indexes

- `idx_lanes_origin_city` - Origin city search
- `idx_lanes_destination_city` - Destination city search
- `idx_lanes_route` - Route lookup (origin + destination)
- `idx_quotes_created_at` - Quote sorting by date
- `idx_quotes_status` - Quote filtering by status
- `idx_quotes_lane_id` - Quote-lane relationship
- `idx_quotes_pickup_date` - Quote filtering by pickup date

## Common Tasks

### Reset Database (Fresh Start)

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS shipment_quotes;"
psql -U postgres -c "CREATE DATABASE shipment_quotes;"

# Run migrations and seed
npm run seed
```

### View Logs

PostgreSQL logs location:
- macOS (Homebrew): `/usr/local/var/log/postgresql@15.log`
- Ubuntu: `/var/log/postgresql/postgresql-15-main.log`

### Backup Database

```bash
pg_dump -U postgres shipment_quotes > backup.sql
```

### Restore Database

```bash
psql -U postgres shipment_quotes < backup.sql
```

## Connection Pooling

The application uses `pg.Pool` with the following settings:
- Max connections: 20
- Idle timeout: 30 seconds
- Connection timeout: 2 seconds

These can be adjusted in `backend/src/config/database.js`.

## Troubleshooting

### Cannot connect to PostgreSQL

1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list

   # Linux
   sudo systemctl status postgresql
   ```

2. Verify connection settings in `.env` file

3. Check PostgreSQL allows local connections in `pg_hba.conf`

### Migration errors

If you see schema errors, drop and recreate the database:

```bash
npm run seed
```

### Permission errors

Grant proper privileges:

```sql
GRANT ALL PRIVILEGES ON DATABASE shipment_quotes TO your_user;
GRANT ALL ON SCHEMA public TO your_user;
```

## Production Deployment

### Environment Variables

Set the following in your production environment:

```env
NODE_ENV=production
DB_HOST=your-production-host
DB_PORT=5432
DB_NAME=shipment_quotes
DB_USER=your-production-user
DB_PASSWORD=strong-production-password
```

### Security Best Practices

1. Use strong passwords
2. Enable SSL/TLS for database connections
3. Restrict database access by IP
4. Regular backups
5. Monitor connection pool usage
6. Use read replicas for scaling

### SSL Configuration (Production)

Update `database.js` to enable SSL:

```javascript
const dbConfig = {
  // ... other settings
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
};
```

## Migration from SQLite

Your project has been migrated from SQLite to PostgreSQL with the following improvements:

### Key Changes

1. **Connection Pooling**: Better performance and connection management
2. **Type Safety**: Using PostgreSQL ENUM types for status fields
3. **Precision**: Using NUMERIC instead of REAL for monetary values
4. **Timestamps**: Using TIMESTAMPTZ for timezone-aware timestamps
5. **Indexing**: Optimized indexes for query performance
6. **Auto-updates**: Triggers for `updated_at` columns
7. **Constraints**: Better data integrity with CHECK constraints

### Query Changes

- Parameterized queries use `$1, $2` instead of `?`
- `ILIKE` for case-insensitive search instead of `LIKE` with `LOWER()`
- Boolean values use `true/false` instead of `0/1`
- `SERIAL` for auto-increment instead of `AUTOINCREMENT`
- All database operations are now async/await

## Support

For issues or questions:
- Check PostgreSQL logs
- Review application logs
- Verify environment variables
- Test database connection manually with `psql`
