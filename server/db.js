const pg = require('pg');//1 export pg client //create connection between init and postgreSQL
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_reservations_db');//1 set up postgres to db
const uuid = require('uuid');
 
const createCustomers = async(name)=>{

    const SQL = `
    INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];

  }

  const createOpenings = async(name)=> {
    const SQL = `
      INSERT INTO openings(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
  };
  const fetchUsers = async()=> {
    const SQL = `
  SELECT *
  FROM customers
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchPlaces = async()=> {
    const SQL = `
  SELECT *
  FROM openings
    `;
    const response = await client.query(SQL);
    return response.rows;
  };

  const createReservation = async({ opening_id, customer_id, reservation_date})=> {
    const SQL = `
      INSERT INTO restaurantdbs(id, opening_id, customer_id, reservation_date) VALUES($1, $2, $3, $4) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), opening_id, customer_id, reservation_date]);
    return response.rows[0];
  };
  const fetchReservation = async()=> {
    const SQL = `
  SELECT *
  FROM restaurantdbs
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  const destroyReservation = async(id)=> {
    const SQL = `
  DELETE FROM restaurantdbs
  where id = $1
    `;
    await client.query(SQL, [id]);
  };
async function createTables(){//2 create table

  const SQL =`
    DROP TABLE IF EXISTS restaurantdbs;
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS openings;

    CREATE TABLE customers(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
      );
      CREATE TABLE openings(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
      );
      CREATE TABLE restaurantdbs(
        id UUID PRIMARY KEY,
        customer_id UUID REFERENCES customers(id) NOT NULL,
        opening_id UUID REFERENCES openings(id) NOT NULL,
        reservation_date DATE
      );
`
await client.query(SQL);
}

module.exports = {//1. 
  client,createTables,createCustomers,createOpenings,  fetchUsers,
  fetchPlaces,createReservation,fetchReservation,destroyReservation
};//2. add createTable 3. add createCustomer,createTables