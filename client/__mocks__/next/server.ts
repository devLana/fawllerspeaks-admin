export const NextResponse = {
  next: vi.fn().mockName("NextResponse.next()"),
  redirect: vi.fn().mockName("NextResponse.redirect()"),
  rewrite: vi.fn().mockName("NextResponse.rewrite()"),
};
