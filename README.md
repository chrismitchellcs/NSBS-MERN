Currently the app is being hosted here: <a href="https://nsbs-mern-frontend.vercel.app/" target="_blank">North Shore Bike Shop Website</a>


This is a website for North Shore Bike Shop (NSBS), a mountain bicycle store based in North Vancouver, BC.  This website allows customers to access information about the store, as well as the bikes that are in stock and availiable to order.

The website allows authenticated employees to log into an admin page where they can manage inventory of the bikes.  Employees can add all of the details of individual bikes and upload images so that customers can see what is in stock.  This admin page is hosted on the front end and accessible only through a secret password.

The website uses React for the frontend, with Material UI and Styled Components.  The rest of the app is powered by the MERN stack, using MongoDB Atlas.  It also uses cloudinary for image uploading.  Cloudinary allows images to be stored in the database only by the name of the image, and all data send and recieved to Cloudinary is done from the frontend.  This allows for smaller transcations between the front end and the back end.   

This app can scale easily to a full inventory management system that doesn't include just bikes, but all parts that are sold at the bike shop.  It is also only one step away from being able to process payments and get shipping details if the store decides to sell products online.
