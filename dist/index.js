import app from "./app.js";
import config from "./utils/env.js";
app.listen(config.PORT, () => {
    console.log(`Server Erunning at ${config.HOST}:${config.PORT}`);
    console.log(`Jangan lupa kirim header: X-API-Key: secret-api-key-123`);
});
//# sourceMappingURL=index.js.map
