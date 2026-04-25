export interface TavilyResult {
    url: string;
    title: string;
    content: string;
    score: number;
}

export interface TavilySearchResponse {
    query: string;
    answer: string | null;
    results: TavilyResult[];
}

export async function tavilySearch(query: string, maxResults = 5): Promise<TavilySearchResponse> {
    const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query,
            max_results: maxResults,
            search_depth: "basic",
        }),
    });

    if (!response.ok) {
        throw new Error(`Tavily API error: ${response.statusText}`);
    }

    return response.json();
}

export async function tavilyResearchForScoping(projectDescription: string): Promise<{ context: string; sources: { title: string; url: string }[] }> {
    const queries = [
        `${projectDescription} freelance development cost 2026`,
        `${projectDescription} project timeline estimation`,
        `market rates for ${projectDescription} development`,
    ];

    const results = await Promise.allSettled(
        queries.map((q) => tavilySearch(q, 3))
    );

    const allResults = results
        .filter((r): r is PromiseFulfilledResult<TavilySearchResponse> => r.status === "fulfilled")
        .flatMap((r) => r.value.results);

    const sources = allResults.map((r) => ({ title: r.title, url: r.url }));
    const context = allResults
        .map((r) => `- [${r.title}](${r.url}): ${r.content.slice(0, 200)}`)
        .join("\n\n");

    return { context: context || "No live market data found.", sources };
}
