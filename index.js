var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
const restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
const schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

const root = {
  restaurant: ({id}) => {
    for(const restaurant of restaurants){
      if (restaurant.id===id);{
        return restaurant;
      }
    }
  },
  restaurants: () => {
    return restaurants;
  },
  setrestaurant: ({ input }) => {
    const {name,description}=input;
    const newRestaurant ={
      name,
      description,
      id: restaurants.length+1,
      dishes:[]
    };   
    restaurants.push(newRestaurant);
    return newRestaurant;

  },
  deleterestaurant: ({ id }) => {
    for(let i=0; i<restaurants.length;i++){
      const restaurant=restaurants[i];
      if (restaurant.id==id);{
        const i = id-1
        restaurants.splice(i,1);
        return {ok:true}; 
      }
      return {ok:false}
    }
  },
  editrestaurant: ({ id, ...restaurant }) => {
    if (!restaurants[id-1]) {
      throw new Error("restaurant doesn't exist");
    }
    restaurants[id-1] = {
      ...restaurants[id-1],
      ...restaurant,
    };
    return restaurants[id-1];
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));