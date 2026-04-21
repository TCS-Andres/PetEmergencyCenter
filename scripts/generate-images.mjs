#!/usr/bin/env node
// Generate site imagery via kie.ai (Nano Banana Pro / Nano Banana 2).
// Reads a plan (JSON), creates tasks, polls for results, downloads to disk.
//
// Usage:
//   node scripts/generate-images.mjs              # uses img-plan.json
//   node scripts/generate-images.mjs plan.json    # custom plan
//   DRY_RUN=1 node scripts/generate-images.mjs    # no API calls, print what would run
//   FORCE=1 node scripts/generate-images.mjs      # regenerate even if file exists
//   ONLY=home-hero,tele-hero node scripts/...     # subset by id

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CREATE_URL = 'https://api.kie.ai/api/v1/jobs/createTask';
const POLL_URL = 'https://api.kie.ai/api/v1/jobs/recordInfo';
const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

// Tiny .env parser — no external deps.
async function loadEnv() {
  try {
    const raw = await readFile(resolve(ROOT, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/i);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function exists(path) {
  try { await access(path, fsConstants.F_OK); return true; } catch { return false; }
}

async function createTask(apiKey, { model, prompt, styleSuffix, aspect_ratio, resolution, output_format, image_input }) {
  const fullPrompt = styleSuffix ? `${prompt}\n\nStyle: ${styleSuffix}` : prompt;
  const body = {
    model,
    input: {
      prompt: fullPrompt,
      image_input: image_input ?? [],
      aspect_ratio: aspect_ratio ?? '1:1',
      resolution: resolution ?? '1K',
      output_format: output_format ?? 'jpg',
    },
  };
  const res = await fetch(CREATE_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(`createTask failed: ${json.code} ${json.msg}`);
  return json.data.taskId;
}

async function pollUntilDone(apiKey, taskId) {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const res = await fetch(`${POLL_URL}?taskId=${encodeURIComponent(taskId)}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    const json = await res.json();
    if (json.code !== 200) throw new Error(`poll failed: ${json.code} ${json.msg}`);
    const { state, resultJson, failCode, failMsg } = json.data;
    if (state === 'success') return JSON.parse(resultJson);
    if (state === 'fail') throw new Error(`task failed: ${failCode} ${failMsg}`);
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error(`task ${taskId} timed out after ${POLL_TIMEOUT_MS}ms`);
}

async function downloadTo(url, path) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, buf);
  return buf.length;
}

async function main() {
  await loadEnv();
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) { console.error('Missing KIE_API_KEY in .env'); process.exit(1); }

  const planPath = resolve(ROOT, process.argv[2] || 'img-plan.json');
  const plan = JSON.parse(await readFile(planPath, 'utf8'));
  const only = (process.env.ONLY || '').split(',').map((s) => s.trim()).filter(Boolean);
  const dryRun = process.env.DRY_RUN === '1';
  const force = process.env.FORCE === '1';

  const images = plan.images.filter((img) => only.length === 0 || only.includes(img.id));
  console.log(`plan: ${images.length} image(s)${dryRun ? ' [DRY RUN]' : ''}${force ? ' [FORCE]' : ''}`);

  let made = 0, skipped = 0, failed = 0;
  for (const img of images) {
    const outPath = resolve(ROOT, img.path);
    if (!force && await exists(outPath)) { console.log(`  skip ${img.id} (exists)`); skipped++; continue; }
    console.log(`  → ${img.id} (${img.model}, ${img.aspect_ratio || '1:1'}, ${img.resolution || '1K'})`);
    if (dryRun) { console.log(`     prompt: ${img.prompt.slice(0, 80)}${img.prompt.length > 80 ? '…' : ''}`); made++; continue; }
    try {
      const t0 = Date.now();
      const taskId = await createTask(apiKey, { ...img, styleSuffix: plan.style_suffix });
      console.log(`     taskId ${taskId}`);
      const result = await pollUntilDone(apiKey, taskId);
      const url = result.resultUrls?.[0];
      if (!url) throw new Error('no resultUrl in response');
      const bytes = await downloadTo(url, outPath);
      console.log(`     ✓ saved ${img.path} (${(bytes/1024).toFixed(0)}kb, ${((Date.now()-t0)/1000).toFixed(1)}s)`);
      made++;
    } catch (e) {
      console.error(`     ✗ ${img.id}: ${e.message}`);
      failed++;
    }
  }
  console.log(`\ndone: ${made} made, ${skipped} skipped, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
