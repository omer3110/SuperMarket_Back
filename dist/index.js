"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const user_route_1 = __importDefault(require("./routes/user.route")); // User routes
const auth_route_1 = __importDefault(require("./routes/auth.route")); // Auth routes
const cart_route_1 = __importDefault(require("./routes/cart.route")); // Cart routes
const product_route_1 = __importDefault(require("./routes/product.route")); // Product routes
const auth_middleware_1 = require("./middlewares/auth.middleware");
const sockets_1 = require("./config/sockets");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
async function main() {
    // Connect to database
    await (0, db_1.default)();
    // MIDDLEWARES
    sockets_1.app.use(express_1.default.json());
    sockets_1.app.use(express_1.default.static("public"));
    // allow CORS for local development (for production, you should configure it properly)
    sockets_1.app.use((0, cors_1.default)()
    // cors({
    //   origin: "http://localhost:5173",
    // })
    );
    // ROUTES
    sockets_1.app.use("/api/auth", auth_route_1.default); // Use auth routes
    sockets_1.app.use("/api/user", auth_middleware_1.verifyToken, user_route_1.default); // Use user routes
    sockets_1.app.use("/api/products", product_route_1.default); // Use product routes
    sockets_1.app.use("/api/cart", auth_middleware_1.verifyToken, cart_route_1.default); // Use cart routes
    // START SERVER
    sockets_1.server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}
main();
