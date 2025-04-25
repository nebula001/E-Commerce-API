require("dotenv").config();
const express = require("express");

//Utilities
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
const yaml = require("js-yaml");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

//Security Packages
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const xssMiddleware = require("./middlewares/xss-filter");
const mongoSanitize = require("express-mongo-sanitize");

//Middlewares
const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFoundMiddleware = require("./middlewares/not-found");

//Routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "Too many requests from this IP, Please try again later",
});

//Security Middleware Setup
app.set("trust proxy", 1);
app.use(limiter);
app.use(xssMiddleware);
app.use(cors());
app.use(helmet());
//app.use(mongoSanitize());

//Utilities Middleware Setup
app.use(morgan("tiny"));
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("public"));

//Swagger UI
const swaggerDocument = yaml.load(
  fs.readFileSync(path.join(__dirname, "Swagger_version_2.yaml"), "utf8")
);

//Routes
app.get("/", (req, res) => {
  res.send("E-Commerce API");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Database successfully connected");
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
