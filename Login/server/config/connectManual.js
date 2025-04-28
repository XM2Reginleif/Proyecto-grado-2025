import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config(); 

export async function connectManual() {
  const uri = process.env.URI_MONGODB;

  if (!uri) {
    console.error('No se encontró URI_MONGODB en .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexión a MongoDB (manual) exitosa');
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error.message);
    process.exit(1);
  }
}
