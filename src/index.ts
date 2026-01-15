import app from "./app";
import config from "./utils/env";

const PORT = Number(config.PORT) || 5000;
const HOST = config.HOST;

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running in ${config.NODE_ENV} mode`);
  console.log(`📡 Host: ${HOST}:${PORT}`);
  
  if (config.NODE_ENV === 'development') {
    console.log(`🔗 Local: http://localhost:${PORT}`);
  }
});