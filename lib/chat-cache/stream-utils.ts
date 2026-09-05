/**
 * Creates a ReadableStream from a static or cached string.
 * Mimics token streaming so the client UI consumes it identically to live AI responses.
 */
export function createCachedStreamResponse(
  text: string,
  options: {
    activeConvId?: string | null;
    cacheSource: "faq" | "memory" | "database";
  }
): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
      "X-Cache": "HIT",
      "X-Cache-Source": options.cacheSource,
      ...(options.activeConvId ? { "X-Conversation-Id": options.activeConvId } : {}),
    },
  });
}
