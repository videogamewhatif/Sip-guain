// Load only in the local integration test. Never contacts Resend.
const realFetch = globalThis.fetch;

globalThis.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input.url ?? input.href;
  if (url !== 'https://api.resend.com/emails') return realFetch(input, init);
  const data = JSON.parse(init.body);
  if (!data.reply_to.endsWith('@example.test') || !data.to.includes('owner@example.test') ||
      !data.text.includes(data.reply_to) || init.headers.Authorization !== 'Bearer local-mock') {
    return Response.json({ message: 'Mock rejected payload' }, { status: 400 });
  }
  if (data.subject.endsWith('Falla simulada')) return Response.json({}, { status: 502 });
  return Response.json({ id: 'mock-id' });
};
