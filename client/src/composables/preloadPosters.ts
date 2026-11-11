function loadPoster(url: string, priority: "high" | "low", signal: AbortSignal) {
  if (signal.aborted) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const image = new Image();
    const finish = () => {
      signal.removeEventListener("abort", abort);
      image.onload = null;
      image.onerror = null;
      resolve();
    };
    const abort = () => {
      finish();
      image.removeAttribute("src");
    };
    image.onload = finish;
    image.onerror = finish;
    image.crossOrigin = "anonymous";
    image.fetchPriority = priority;
    signal.addEventListener("abort", abort, { once: true });
    image.src = url;
  });
}

export async function preloadPosters(
  first: string[],
  posters: string[],
  signal: AbortSignal,
) {
  const priority = new Set(first);
  const priorityLoads = [...priority].map((url) => loadPoster(url, "high", signal));
  await priorityLoads[0];

  for (const url of new Set(posters)) {
    if (signal.aborted) return;
    if (!priority.has(url)) await loadPoster(url, "low", signal);
  }
  await Promise.all(priorityLoads);
}
