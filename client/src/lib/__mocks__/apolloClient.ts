const client = {
  mutate: jest.fn().mockName("client.mutate"),
};

export default jest.fn(() => {
  return client;
});
