/**
 * Split point for the animation feature bundle.
 *
 * `LazyMotion` loads this on its own after the first render, so ~27KB of
 * animation runtime stays off the critical path. Nothing above the fold
 * depends on it — the hero animates in CSS — so the only visible effect is
 * that scroll reveals become active a beat after the page is interactive.
 */
export { domAnimation as default } from 'framer-motion';
