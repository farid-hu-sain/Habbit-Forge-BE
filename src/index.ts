import app from "./app.js";
import config from "./utils/env.js";


app.listen(config.PORT, () => {
  console.log(`🚀 Server running in ${config.NODE_ENV} mode`);
  
});