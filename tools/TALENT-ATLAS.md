# Talent Atlas: the film is the website

The English and Arabic Talent Atlas routes are native-scroll-controlled movies, following the user's CUT THE STRINGS and Disney Worlds implementations. The 90-second film occupies one fixed viewport; document scrolling determines its real video playhead. Reversing the scroll reverses the film. It stays paused when scrolling stops. There are no product-page panels around a separate player.

## Delivery

The public routes are /en/work/talent-atlas/ and /ar/work/talent-atlas/. Both are linked from the collection gallery, the cinema chapter menu and the production index.

The complete composition is visible by default, as in CUT THE STRINGS. Portrait visitors can choose Fill screen, which pans from the film's title area into the interface. Full frame returns to the uncropped composition. Rotation retains film position.

The default scroll film is silent. Play + sound explicitly plays the same movie with its original score, advancing the document playhead. Touching or scrolling the picture returns control to the visitor. The slider and chapter buttons are keyboard alternatives.

## Assets and implementation

- media/talent-atlas/scroll-film.js: one seek in flight, newest requested time wins; native scrolling; no wheel interception.
- media/talent-atlas/scroll-film.css: fixed viewport, safe-area controls, full frame/fill framing, accessible dialog.
- tools/build-talent-atlas-film.py: deterministic English and Arabic HTML generation.
- tools/integrate-talent-atlas.py: additive integration into the existing static portfolio indexes; updates saved cinema-shell hashes without adding the film to its bulk preload.
- film-scroll-phone.mp4: 1280 x 720, 30 fps, four-frame keyframe interval.
- film-scroll-desktop.mp4: 1920 x 1080, 30 fps, six-frame keyframe interval.
- talent-atlas-film-v2.1.mp4: compact conventional playback/download encode.

All video files derive from the preserved V2.1 master. These short keyframe intervals support forward and reverse seeking on phones. Only the appropriate screen-size video is requested.

## Accessibility and boundaries

System reduced motion requires explicit opt-in to scroll playback; chapters and normal playback remain available. Native dialog focus/escape behavior, keyboard slider, previous/next controls, media retry, direct-film fallback, Arabic RTL controls and a no-script film link are included.

The UI is bilingual; the source film itself contains English interface text. The film uses fictional demo records. Planned providers and production AI agents remain labelled in development.

## Verification

Browser checks cover desktop, portrait phone, landscape phone and Arabic phone viewports; eleven forward/reverse time positions per viewport; idle frame stability; full-frame/fill toggle; chapter navigation; sound playback/pause; orientation continuity; reduced-motion opt-in and failed-media recovery. This is browser emulation, not a physical-phone or iOS Safari acceptance claim.

The companion private source and master are maintained in Mohamed3042/talent-atlas under marketing/film-v2.1 and release film-v2.1-20261003. No private recruiting data, application source or source archives are copied to this public portfolio.
