import express from 'express';

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