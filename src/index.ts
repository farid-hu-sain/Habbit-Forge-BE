import app from "./app";
import config from "./utils/env";

const PORT = Number(config.PORT) || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Documentation: /api-docs`);
  console.log(`✅ Health check: /`);
  
  if (config.NODE_ENV === 'development') {
    console.log(`🔗 Local: http://localhost:${PORT}`);
  }
});