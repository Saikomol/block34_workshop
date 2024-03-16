const { client,createTables,createCustomers,createOpenings,  fetchUsers,
    fetchPlaces,createReservation,fetchReservation,destroyReservation } = require('./db');//call client from db
    const express = require("express");
    const app = express();
    app.use(express.json());
    app.get('/api/customers', async(req, res, next)=> {
        try {
          res.send(await fetchUsers());
        }
        catch(ex){
          next(ex);
        }
      });
      
      app.get('/api/openings', async(req, res, next)=> {
        try {
          res.send(await fetchPlaces());
        }
        catch(ex){
          next(ex);
        }
      });
      
      app.get('/api/restaurantdbs', async(req, res, next)=> {
        try {
          res.send(await fetchReservation());
        }
        catch(ex){
          next(ex);
        }
      });
      app.post('/api/restaurantdbs', async(req, res, next)=> {
        //const {opening_id, customer_id, reservation_date} = req.body; create deconstruction so we not use req.body. in there
        try {
          res.send(await createReservation( req.body.reservation_date,req.body.customer_id,req.body.opening_id));
        }
        catch(ex){
          next(ex);
        }
      });
      app.delete('/api/restaurantdbs/:id', async(req, res, next)=> {
        try {
          await destroyReservation(req.params.id);
          res.sendStatus(204);
        }
        catch(ex){
          next(ex);
        }
      });
async function init() {//1
 try{
    await client.connect();//1
    console.log('connected to database');//1
    await createTables();//2
    console.log('tables created');
    const [thomas,percy,gordon,table1,table2,table3,table4]= await Promise.all([
        createCustomers('Thomas'),
        createCustomers('Percy'),
        createCustomers('Gordon'),
        createOpenings('table1'),
        createOpenings('table2'),
        createOpenings('table3'),
        createOpenings('table4')
    ]);
    console.log(`Thomos has an id of ${thomas.id}`);
    console.log(`Percy has an id of ${percy.id}`);
    console.log(await fetchUsers());
    console.log(await fetchPlaces());
    await Promise.all([
        createReservation({ customer_id: thomas.id, opening_id: table1.id, reservation_date: '04/01/2024'}),
        createReservation({ customer_id: percy.id, opening_id: table2.id, reservation_date: '04/15/2024'}),
        createReservation({ customer_id: thomas.id, opening_id: table3.id, reservation_date: '07/04/2024'}),
        createReservation({ customer_id: gordon.id, opening_id: table4.id, reservation_date: '10/31/2024'}),
      ]);
      const reservations = await fetchReservation();
      console.log(reservations);
      await destroyReservation(reservations[0].id);
      console.log(await fetchReservation());
      const port = process.env.PORT || 3000;
      app.listen(port, ()=> console.log(`listening on port ${port}`));
      console.log(`curl localhost:${port}/api/restaurantdbs`);
      console.log(`curl localhost:${port}/api/openings`);      
      console.log(`curl localhost:${port}/api/customers`);
}catch(err){
    console.error(err);
}

    
};

init()