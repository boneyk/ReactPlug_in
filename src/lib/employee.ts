interface Employee {
  id: number;
  fullName: string;
  work: string;
  email: string;
}

interface ScoredEmployee {
  score: number;
  employee: Employee;
}

// TODO это ради прикола, бэк уже делает поиск 🇯🇵(*^ω^*)✨ (вроде...)
function getTrigrams(str: string): Set<string> {
  const reworkedString = str.toLowerCase().replace(/\s+/g, ' ').trim();
  const trigrams = new Set<string>();
  for (let i = 0; i <= reworkedString.length - 3; i++) trigrams.add(reworkedString.slice(i, i + 3));

  return trigrams;
}

function trigramSimilarity(query: string, target: string): number {
  const queryTrigrams = getTrigrams(query);
  const targetTrigrams = getTrigrams(target);

  if (queryTrigrams.size === 0 || targetTrigrams.size === 0) return 0;

  let intersection = 0;
  for (const trigram of queryTrigrams) {
    if (targetTrigrams.has(trigram)) intersection++;
  }

  return intersection / Math.max(queryTrigrams.size, targetTrigrams.size);
}

function includesScore(query: string, target: string): number {
  const reworkedQuery = query.toLowerCase().trim();
  const reworkedTarget = target.toLowerCase().trim();
  if (reworkedTarget.includes(reworkedQuery)) return 1;
  if (reworkedQuery.length >= 2 && reworkedTarget.includes(reworkedQuery.slice(0, -1))) return 0.8;
  return 0;
}

function getFuzzyScore(query: string, target: string): number {
  return Math.max(trigramSimilarity(query, target), includesScore(query, target));
}

export function scoredSearch(request: string, allData: Employee[], threshold: number = 0.3): Employee[] {
  if (!request.trim()) return allData;

  const scoredData: ScoredEmployee[] = [];
  allData.forEach((employee) => {
    const score = Math.max(getFuzzyScore(request, employee.email), getFuzzyScore(request, employee.fullName));
    if (score >= threshold) {
      scoredData.push({ score, employee });
    }
  });
  return scoredData.sort((a, b) => b.score - a.score).map((item) => item.employee);
}
