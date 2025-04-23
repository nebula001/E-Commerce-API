[
  {
    $match: {
      product: new ObjectId("6807848e86cbc4c94bd3d2e4"),
    },
  },
  {
    $group: {
      _id: "$product",
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];
