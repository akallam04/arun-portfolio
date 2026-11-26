export const CONTACT_LIMITS = {
  nameMax: 100,
  emailMax: 200,
  messageMin: 10,
  messageMax: 3000,
  minMillis: 3000,
} as const;

export const CONTACT_TOPICS = [
  { value: "role", label: "a full-time role", subject: "full-time role" },
  { value: "project", label: "a project", subject: "project" },
  { value: "other", label: "something else", subject: "something else" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

export type ContactFields = { name: string; email: string; topic: ContactTopic; message: string };
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isTopic(value: unknown): value is ContactTopic {
  return CONTACT_TOPICS.some((topic) => topic.value === value);
}

export function topicSubject(topic: ContactTopic) {
  return CONTACT_TOPICS.find((item) => item.value === topic)?.subject ?? "something else";
}

export function validateContact(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();

  if (!name) errors.name = "Add your name so I know who is writing.";
  else if (name.length > CONTACT_LIMITS.nameMax) errors.name = "Shorten your name to under 100 characters.";

  if (!isTopic(fields.topic)) errors.topic = "Pick what you're writing about.";

  if (!email) errors.email = "Add your email so I can reply.";
  else if (email.length > CONTACT_LIMITS.emailMax) errors.email = "Shorten your email to under 200 characters.";
  else if (!EMAIL.test(email)) errors.email = "Check your email. It should look like name@example.com.";

  if (message.length < CONTACT_LIMITS.messageMin) errors.message = "Write a little more: at least 10 characters.";
  else if (message.length > CONTACT_LIMITS.messageMax) errors.message = "Shorten your message to under 3,000 characters.";

  return errors;
}
