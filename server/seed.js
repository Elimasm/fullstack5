/**
 * Seed script — fetches data from jsonplaceholder.typicode.com
 * and writes it to server/json.db with real image URLs from picsum.photos.
 *
 * Run: npm run seed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE = 'https://jsonplaceholder.typicode.com';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    const [users, todos, posts, comments, albums, photos] = await Promise.all([
      fetchJSON(`${BASE}/users`),
      fetchJSON(`${BASE}/todos`),
      fetchJSON(`${BASE}/posts`),
      fetchJSON(`${BASE}/comments`),
      fetchJSON(`${BASE}/albums`),
      fetchJSON(`${BASE}/photos`),
    ]);

    // Replace placeholder images with real picsum.photos URLs
    const updatedPhotos = photos.map((photo, index) => ({
      ...photo,
      url: `https://picsum.photos/id/${(index % 200) + 10}/600/600`,
      thumbnailUrl: `https://picsum.photos/id/${(index % 200) + 10}/150/150`,
    }));

    const db = {
      users,
      todos,
      posts,
      comments,
      albums,
      photos: updatedPhotos,
    };

    const outputPath = path.join(__dirname, 'db.json');
    fs.writeFileSync(outputPath, JSON.stringify(db, null, 2), 'utf-8');

    console.log(`✅ Database seeded successfully at ${outputPath}`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${todos.length} todos`);
    console.log(`   - ${posts.length} posts`);
    console.log(`   - ${comments.length} comments`);
    console.log(`   - ${albums.length} albums`);
    console.log(`   - ${updatedPhotos.length} photos`);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
