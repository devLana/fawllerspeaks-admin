let handler: (() => void) | null = null;

const routerObject = {
  pathname: "/",
  query: {},
  isReady: true,
  events: {
    on: vi
      .fn((_, callback: () => void) => {
        handler = callback;
      })
      .mockName("router.events.on"),
    off: vi
      .fn()
      .mockImplementation(() => {
        handler = null;
      })
      .mockName("router.events.off"),
  },
  push: vi
    .fn(() => {
      if (handler) handler();
    })
    .mockName("router.push"),
  replace: vi
    .fn(() => {
      if (handler) handler();
    })
    .mockName("router.replace"),
  reload: vi.fn().mockName("router.reload"),
};

export const useRouter = vi.fn(() => routerObject);
