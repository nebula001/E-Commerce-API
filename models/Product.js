const mongoose = require("mongoose");
const categories = ["office", "kitchen", "bedroom"];
const companies = ["ikea", "liddy", "marcos"];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide Product name"],
      maxlength: [100, "Name can not be more than 100 characters"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Please provide product price"],
    },

    description: {
      type: String,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
      required: [true, "Please provide product description"],
    },

    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },

    category: {
      type: String,
      required: [true, "Please provide product category"],
      validate: {
        validator: function (value) {
          return categories.includes(value);
        },
        message: function (props) {
          return `${
            props.value
          } is not supported. Please choose from ${categories.join(", ")}`;
        },
      },
    },

    company: {
      type: String,
      required: [true, "Please provide company"],
      validate: {
        validator: function (value) {
          return companies.includes(value);
        },
        message: function (props) {
          return `${
            props.value
          } is not supported. Please choose from ${companies.join(", ")}`;
        },
      },
    },

    colors: {
      type: [String],
      default: ["#222"],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },

    inventory: {
      type: Number,
      required: true,
      default: 15,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

module.exports = mongoose.model("Product", productSchema);
