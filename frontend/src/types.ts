export type ApiError = {
  data: {
    msg: string;
  };
};

//auth slice
export type UserType = {
  username: string;
  email: string;
  userId: string;
  isAdmin: boolean;
} | null;

export type UserDetailsType = {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  favorites: any[];
  createdAt: Date | string;
  updatedAt: Date | string;
  __v: number;
} | null;

export type AuthStateType = {
  currentUser: UserType | null;
  userDetails: UserDetailsType | null;
};
//CATEGORY
export type Category = {
  _id: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

//PRODUCT
export type Review = {
  title: string;
  comment: string;
  rating: number;
  user: string;
  _id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Product = {
  _id: string;
  name: string;
  image: string;
  brand: string;
  category: {
    _id: string;
    name: string;
  };
  description: string;
  price: number;
  countInStock: number;
  reviews: Review[];
  createdAt: Date | string;
  updatedAt: Date | string;
  __v: number;
  averageRating: number;
  numReviews: number;
  id?: string;
};
//product filters
export type Filters = {
  name: string;
  category: string;
  priceGte: string;
  priceLte: string;
  page: number;
};
// CART
export type CartProduct = Product & {
  qty: number;
};
//orders
export type OrderItemArg = {
  product: string | Product;
  qty: number;
  _id?: string;
};

export type Order = {
  shippingAddress: {
    phoneNumber: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  _id: string;
  user:
    | string
    | {
        _id: string;
        username: string;
        email: string;
      };
  orderItems: OrderItemArg[];
  itemsPrice: number;
  shippingStatus: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  __v: number;
};
