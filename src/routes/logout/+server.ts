import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete('session', { path: '/' });
  cookies.delete('refreshToken', { path: '/' });
  return new Response(null, { status: 204 });
};