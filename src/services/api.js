// Simple mocked API layer for demo purposes

export function checkAccess() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allowed = Math.random() < 0.6; // 60% chance allowed
      resolve({ allowed });
    }, 800);
  });
}

export function getQuestions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const questions = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        text: `Question ${i + 1}: Why is HTTPS important?`,
        options: [
          "Encrypts data in transit",
          "Improves SEO only",
          "Caches client inputs",
          "Manages server CPU",
        ].sort(() => Math.random() - 0.5),
      }));
      resolve({ questions });
    }, 700);
  });
}


