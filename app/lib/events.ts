export type RECENT_EVENTS = {
  boss: {
    name: string;
    expectedName: string;
    nextExpectedName: string;
    timestamp: number;
    expected: number;
    nextExpected: number;
    territory: string;
    zone: string;
  };
  helltide: {
    timestamp: number;
    zone: string;
    refresh: number;
  };
  legion: {
    timestamp: number;
    territory: string;
    zone: string;
    expected: number;
    nextExpected: number;
  };
};

export async function getRecentEvents() {
  const response = await fetch(`https://d4armory.io/api/events/recent`);
  const data = (await response.json()) as RECENT_EVENTS;
  return data;
}
