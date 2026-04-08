export const CATEGORIES = [
  "Ability", "Acting", "Action", "Adventure", "Age", "Ambition", "Anger", "Art", "Attitude",
  "Beauty", "Belief", "Birthday", "Business",
  "Change", "Character", "Christmas", "Communication", "Computers", "Confidence", "Courage",
  "Death", "Design", "Dreams",
  "Education", "Experience",
  "Failure", "Faith", "Family", "Fear", "Fitness", "Food", "Forgiveness", "Freedom", "Friendship", "Future",
  "Genius", "God", "Good", "Government", "Gratitude", "Greatness",
  "Happiness", "Health", "History", "Home", "Hope", "Humor",
  "Imagination", "Independence", "Inspiration", "Intelligence",
  "Jealousy", "Journalism", "Justice",
  "Kindness", "Knowledge",
  "Leadership", "Learning", "Legal", "Life", "Loneliness", "Love", "Luck",
  "Marriage", "Medical", "Men", "Mom", "Money", "Morning", "Movies", "Music",
  "Nature",
  "Pain", "Patience", "Peace", "Philosophy", "Poetry", "Politics", "Positive", "Power",
  "Relationship", "Religion", "Respect",
  "Sad", "Science", "Smile", "Society", "Space", "Sports", "Strength", "Success", "Sympathy",
  "Teacher", "Technology", "Time", "Travel", "Trust", "Truth",
  "Victory", "Virtue",
  "War", "Wedding", "Wisdom", "Women", "Work",
  "Youth"
] as const;

export type Category = typeof CATEGORIES[number];
