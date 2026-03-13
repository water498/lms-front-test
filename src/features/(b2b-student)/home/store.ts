// B2B store — wishlist only (no cart, no individual payment flow)
// Persists across soft navigations (Next.js), resets on hard refresh

const store = {
  wishlist: new Set<string>(),
};

export default store;
