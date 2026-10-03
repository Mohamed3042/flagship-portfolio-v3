# Job Engine Orbit — The scroll film

The complete video is the website at `/{lang}/work/job-orbit/`, under `/flagship-portfolio-v3/`. Native scrolling advances or reverses the actual decoded film. Stopping holds its frame. The world does not call `play()` or replace the movie with still images.

This follows the portfolio's existing [Disney](https://github.com/Mohamed3042/flagship-portfolio/blob/main/public/worlds/disney.html), [Spotify](https://github.com/Mohamed3042/flagship-portfolio/blob/main/public/worlds/spotify.html), and [Cake Studio](https://github.com/Mohamed3042/flagship-portfolio/blob/main/public/worlds/cake-studio-bookends.js) video worlds: a pinned viewport, one global scroll playhead, paused video buffers, and short segments fetched as blobs. Three buffers preserve the visible frame while loading the next target. Adjacent segments are prefetched in the scroll direction; requests far from the playhead are aborted. Loading failures offer a visible retry.

Phone view fills the screen by default. Authored horizontal framing follows the feature panels; **Show full frame** restores the entire original landscape composition. Rotation preserves the scroll position. Desktop defaults to the complete composition and provides **Fill screen**. **Chapters** and the timeline seek the same film. **Watch with sound** opens the original complete film in an optional native player. Reduced motion removes playhead easing while retaining deliberate scroll-controlled video.

Edit localized HTML and chapters in `build-film.mjs`, appearance in `media/job-orbit-flight/film-world.css`, and transport/framing in `media/job-orbit-flight/film-world.js`. Rebuild from the repository root:

```sh
node scripts/job-orbit/build.mjs
```

No install or build dependencies are required. This regenerates only the two Job Orbit pages and their idempotent sitemap entries. GitHub Pages publishes the existing main-branch root. The software notes, cinema and Products collection already link to this route, retaining `project-job-engine-desktop`. The separate `work/job-apply-engine` application manual remains independent.

## Delivery media

Both versions derive from the completed [Job Orbit v2 film](https://github.com/Mohamed3042/motion-video-skill/releases/tag/job-orbit-v2.0). The original 1080p60 master, share film and editable project remain available there. The scroll derivatives use 30 fps, silent H.264, yuv420p, BT.709, half-second keyframes, no B-frames and faststart. Each profile contains 24 five-second clips with zero-based timestamps: all 3,600 frames cover the full 120 seconds. Clips are served from this site's origin.

| Profile | Resolution | Total clip bytes | Largest clip |
| --- | --- | ---: | ---: |
| Phone | 1280 × 720 | 50,402,648 | 4,353,733 |
| Desktop | 1920 × 1080 | 99,923,748 | 8,450,672 |

Each profile's `manifest.json` records individual sizes, SHA-256 hashes, durations, frame counts and encoding properties. Its `sourceSha256` identifies the full delivery derivative before segmentation, rather than the original master. Concatenated decoded frame hashes match that derivative for every frame. The original master remains unchanged, SHA-256 `4282780d9a70edd04beeb7e274e6e03fffb4a0f34abb1f9965bc484d110bf451`.

The poster, brand logo, fonts and prior still-tour assets are retained. The new film page references only the poster where a native player or share preview needs one; its scroll world displays decoded video.

## Verification

On 3 October 2026, Chromium checks covered English desktop, 390- and 320-pixel touch layouts, Arabic phone layout and reduced motion. Decoded pixel samples verify forward and reverse movement, identical frames when revisiting settled positions, and a stationary held frame. Additional checks cover segment boundaries, rapid jumps, actual emulated touch gestures, orientation, chapter jumps, framing controls, zero unintended world playback, horizontal overflow and resource errors. A simulated failed request verifies retry recovery. Representative portrait and landscape frames were inspected.

These checks use browser phone emulation; they are not a physical-phone or Safari review. The original soundtrack was not listened to during this website verification.

Illustrations use fictional sample data and are not runtime captures or evidence of completed applications. The page's information dialog links the [product claim notes](https://github.com/Mohamed3042/motion-video-skill/blob/job-orbit-v2/docs/job-orbit/PRODUCT-TRUTH.md). Existing software acceptance wording remains in the portfolio.
