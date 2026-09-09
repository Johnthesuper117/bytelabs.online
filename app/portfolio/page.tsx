type GitHubUser = {
  followers: number;
  following: number;
  public_repos: number;
};

type GitHubRepo = {
  name: string;
  description: string | null;
  forks_count: number;
  html_url: string;
  language: string | null;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  size: number;
};

type LanguageStat = {
  language: string;
  value: number;
};

type PortfolioData = {
  followers: number;
  following: number;
  publicRepos: number;
  totalForks: number;
  totalStars: number;
  totalWatchers: number;
  topLanguages: LanguageStat[];
  recentRepos: GitHubRepo[];
};

const GITHUB_USERNAME = 'Johnthesuper117';
const GITHUB_API_BASE = 'https://api.github.com';

const fetchGitHubJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'bytelabs-online-portfolio',
    },
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('GitHub API rate limit reached. Please try again shortly.');
    }
    throw new Error(`GitHub API request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
};

const fetchAllRepos = async (username: string): Promise<GitHubRepo[]> => {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (page <= 10) {
    const pageRepos = await fetchGitHubJson<GitHubRepo[]>(
      `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
    );

    repos.push(...pageRepos);
    if (pageRepos.length < perPage) {
      break;
    }

    page += 1;
  }

  return repos;
};

const buildPortfolioData = (user: GitHubUser, repos: GitHubRepo[]): PortfolioData => {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const totalWatchers = repos.reduce((sum, repo) => sum + repo.watchers_count, 0);

  const languageTotals = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language) {
      continue;
    }

    const current = languageTotals.get(repo.language) ?? 0;
    languageTotals.set(repo.language, current + Math.max(repo.size, 1));
  }

  const topLanguages = Array.from(languageTotals.entries())
    .map(([language, value]) => ({ language, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const recentRepos = [...repos]
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .slice(0, 5);

  return {
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    totalForks,
    totalStars,
    totalWatchers,
    topLanguages,
    recentRepos,
  };
};

const numberFormat = new Intl.NumberFormat('en-US');

export default async function PortfolioPage() {
  let data: PortfolioData | null = null;
  let errorMessage: string | null = null;

  try {
    const [user, repos] = await Promise.all([
      fetchGitHubJson<GitHubUser>(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`),
      fetchAllRepos(GITHUB_USERNAME),
    ]);

    data = buildPortfolioData(user, repos);
  } catch (error) {
    errorMessage = error instanceof Error
      ? error.message
      : 'Unable to load GitHub portfolio data right now.';
  }

  const languageMax = data?.topLanguages[0]?.value ?? 1;

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <section style={{ marginBottom: '40px' }}>
        <h1 className="section-title" style={{ marginBottom: '14px' }}>&gt; GITHUB PORTFOLIO</h1>
        <p style={{ maxWidth: '840px', opacity: 0.9 }}>
          Live public GitHub stats and project highlights for @{GITHUB_USERNAME}.
        </p>
      </section>

      {errorMessage && (
        <p
          role="status"
          style={{
            border: '1px solid #FF3131',
            borderRadius: '4px',
            background: 'rgba(255, 49, 49, 0.1)',
            color: '#FFDADA',
            padding: '14px',
            marginBottom: '24px',
          }}
        >
          {errorMessage} Showing fallback values where possible.
        </p>
      )}

      <section aria-label="GitHub key metrics" style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '16px' }}>&gt; Key Metrics</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '14px',
          }}
        >
          {[
            { label: 'Public Repos', value: data?.publicRepos ?? 0 },
            { label: 'Followers', value: data?.followers ?? 0 },
            { label: 'Following', value: data?.following ?? 0 },
            { label: 'Total Stars', value: data?.totalStars ?? 0 },
            { label: 'Total Forks', value: data?.totalForks ?? 0 },
            { label: 'Total Watchers', value: data?.totalWatchers ?? 0 },
          ].map((metric) => (
            <article
              key={metric.label}
              style={{
                border: '1px solid #00FF41',
                borderRadius: '6px',
                padding: '16px',
                background: 'rgba(0, 40, 0, 0.35)',
                minHeight: '92px',
              }}
            >
              <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>{metric.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700 }}>{numberFormat.format(metric.value)}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Top programming languages" style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '16px' }}>&gt; Top Languages</h2>
        {data && data.topLanguages.length > 0 ? (
          <ul style={{ display: 'grid', gap: '12px' }}>
            {data.topLanguages.map((entry) => {
              const width = Math.max(8, Math.round((entry.value / languageMax) * 100));
              return (
                <li key={entry.language}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
                    <span>{entry.language}</span>
                    <span style={{ opacity: 0.8 }}>{numberFormat.format(entry.value)} KB</span>
                  </div>
                  <div style={{ border: '1px solid #00FF41', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${width}%`,
                        minHeight: '9px',
                        background: 'linear-gradient(90deg, #00FF41, #7CFF9F)',
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No language data is currently available.</p>
        )}
      </section>

      <section aria-label="Recently updated repositories">
        <h2 style={{ marginBottom: '16px' }}>&gt; Recent Repositories</h2>
        {data && data.recentRepos.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '14px',
            }}
          >
            {data.recentRepos.map((repo) => (
              <article
                key={repo.name}
                style={{
                  border: '1px solid #00FF41',
                  borderRadius: '6px',
                  padding: '16px',
                  background: 'rgba(0, 20, 0, 0.45)',
                }}
              >
                <h3 style={{ margin: '0 0 8px 0', borderBottom: 'none' }}>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ borderBottom: '1px solid transparent' }}
                  >
                    {repo.name}
                  </a>
                </h3>
                <p style={{ fontSize: '13px', minHeight: '42px', opacity: 0.85, marginBottom: '10px' }}>
                  {repo.description ?? 'No description provided.'}
                </p>
                <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px' }}>
                  {repo.language ?? 'Unknown language'} • ★ {numberFormat.format(repo.stargazers_count)}
                </p>
                <p style={{ fontSize: '12px', opacity: 0.7 }}>
                  Updated {new Date(repo.pushed_at).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p>No recent repositories could be loaded at this time.</p>
        )}
      </section>
    </div>
  );
}
