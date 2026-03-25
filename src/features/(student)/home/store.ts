// Shared mutable state for cart and wishlist
// Persists across soft navigations (Next.js), resets on hard refresh
// Using an object so properties can be mutated from importing modules

const store = {
  cart: new Set<string>(),
  wishlist: new Set<string>(),
};

export default store;
