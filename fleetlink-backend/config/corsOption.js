const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://localhost:3000"]
      : ["http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = corsOptions;
