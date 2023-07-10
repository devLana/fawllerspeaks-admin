let handler: (() => void) | null = null;

const routerObject = {
  pathname: "/",
  query: {},
  isReady: true,
  events: {
    on: jest
      .fn((_, callback: () => void) => {
        handler = callback;
      })
      .mockName("router.events.on"),
    off: jest
      .fn()
      .mockImplementation(() => {
        handler = null;
      })
      .mockName("router.events.off"),
  },
  push: jest
    .fn(() => {
      if (handler) handler();
    })
    .mockName("router.push"),
  replace: jest
    .fn(() => {
      if (handler) handler();
    })
    .mockName("router.replace"),
  reload: jest.fn().mockName("router.reload"),
  beforePopState: jest.fn().mockName("router.beforePopState"),
};

export const useRouter = jest.fn(() => routerObject);
