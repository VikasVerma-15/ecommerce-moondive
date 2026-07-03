import express from 'express';
import cors from 'cors';

import serverconfig from './src/config/index.js';
import v1router from './src/routes/v1/ping.js';
import userRoutes from './src/routes/v1/user.js';
import categoryRoutes from './src/routes/v1/category.js';
import productRoutes from './src/routes/v1/product.js';
import wishlistRoutes from './src/routes/v1/wishlist.js';
import cartRoutes from './src/routes/v1/cart.js';
import contactRoutes from './src/routes/v1/contact.js';
import logger from './src/config/logger.js';
import connectDB from './src/config/db.js';
import errorHandler from './src/middleware/error.js';

const app = express();

app.use(cors({
      allowedHeaders: ["Content-Type", "token", "authorization", "ipaddress", "latitude", "longitude", "machineid"],
      exposedHeaders: ["token", "authorization", "ipaddress", "latitude", "longitude", "machineid"],
      origin: ["http://localhost:3000", "http://35.154.208.216", "capacitor://localhost", "capacitor://35.154.208.216", "https://superareadev.vercel.app", "https://checkout.razorpay.com", "https://www.superarea.ai", "https://superarea.ai"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
      preflightContinue: false,
    }));

app.use(express.json());
app.use('/api/v1',v1router);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/contacts', contactRoutes);

app.use(errorHandler);

app.listen(serverconfig.PORT, async () => {
    await connectDB();
    logger.info(`Server is running on port ${serverconfig.PORT}`);
    
});