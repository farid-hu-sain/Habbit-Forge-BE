import app from "./app";
import config from "./utils/env";
import os from 'os';

const PORT = Number(config.PORT) || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server berjalan di http://${HOST}:${PORT}`);
  console.log(`📚 Lokal: http://localhost:${PORT}`);
  console.log(`📚 Dokumentasi API: http://localhost:${PORT}/api-docs`);
  console.log(`✅ Cek status: http://localhost:${PORT}/`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth`);
  
  const ipAddress = getLocalIpAddress();
  if (ipAddress !== 'localhost') {
    console.log(`🌐 Network: http://${ipAddress}:${PORT}`);
  }
});

function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}