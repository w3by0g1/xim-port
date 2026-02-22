import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'c1jzo27h',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});