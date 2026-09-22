# React Image Editor

[L3] [![npm version](https://img.shields.io/npm/v/@unlayer/react-image-editor.svg)](https://www.npmjs.com/package/@unlayer/react-image-editor)
[L4] [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[L5] [![CI](https://github.com/unlayer/react-image-editor/actions/workflows/ci.yml/badge.svg)](https://github.com/unlayer/react-image-editor/actions/workflows/ci.yml)

The Image Editor as a React.js wrapper component — crop, resize, draw, text, shapes, stickers, frames, filters, and an optional AI Assistant.

<img width="1536" height="1024" alt="react-image-editor-text" src="https://github.com/user-attachments/assets/99bea489-4b82-4e35-bb37-34d1e11e05d5" />

## Live Demo

Try the live demo: [editraa.netlify.app](https://editraa.netlify.app/)

## Installation

```sh
npm install @unlayer/react-image-editor
```

## Usage

Requires React >= 18.

```jsx
import React, { useRef } from 'react';
import ImageEditor from '@unlayer/react-image-editor';

const App = () => {
  const editorRef = useRef(null);

  return (
    <ImageEditor
      ref={editorRef}
      image="https://example.com/photo.jpg"
      options={{ theme: 'light' }}
      onSave={({ dataUrl, blob }) => {
        // Persist the edited image
        console.info('Saved', dataUrl.length, 'bytes');
      }}
      onCancel={() => console.info('Editing cancelled')}
    />
  );
};
```

The component works out of the box in React Server Components environments (e.g. Next.js App Router) — it ships with the `'use client'` directive and touches the DOM only inside effects.

## Props

| Prop           | Type                          | Description                                                |
| -------------- | ----------------------------- | ---------------------------------------------------------- |
| `image`        | `string` (required)           | Image URL or base64 data URL to edit.                      |
| `options`      | `ImageEditorOptions`          | Editor configuration.                                      |
| `editorId`     | `string`                      | id for the container div.                                  |
| `minHeight`    | `number \| string`            | Minimum height of the editor container. Defaults to `500`. |
| `style`        | `CSSProperties`               | Styles applied to the container div.                       |
| `wrapperStyle` | `CSSProperties`               | Styles applied to the outer wrapper div.                   |
| `ariaLabel`    | `string`                      | Accessible name for the editor region.                     |
| `onLoad`       | `(editor) => void`            | Called with the editor instance once it is mounted.        |
| `onSave`       | `({ dataUrl, blob }) => void` | Called when the user saves the edited image.               |
| `onCancel`     | `() => void`                  | Called when the user cancels editing.                      |
| `onLoadError`  | `() => void`                  | Called when the image fails to load into the canvas.       |
| `onError`      | `(error: Error) => void`      | Wrapper-level failures.                                    |

## Editor instance (ref)

The `ref` exposes `{ editor }` — `null` until the editor mounts, then an instance with:

| Method                   | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `getImage()`             | Current canvas as a data URL (flattened), or `null`. |
| `hasChanges()`           | Whether there are unsaved edits.                     |
| `reset(imageUrl?)`       | Reset editor state.                                  |
| `updateOptions(partial)` | Update options like `theme` / `locale` at runtime.   |
| `destroy()`              | Unmount the editor.                                  |

```jsx
const dataUrl = editorRef.current?.editor?.getImage();
```

## How prop changes are applied

| Change                                                       | Behavior                                                                     |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `image`                                                      | Applied via `reset(newImage)` — clears undo/redo history and AI chat.        |
| `options.theme`, `options.locale`, `options.translations`    | Applied via `updateOptions()` — no remount, editor state preserved.          |
| Any other `options` key                                      | Full remount — editor is destroyed and recreated with the new configuration. |
| `onSave` / `onCancel` / `onLoadError` / `onLoad` / `onError` | Always call the latest handler; changing them never remounts.                |

## Error handling

Two distinct channels:

* **`onLoadError`** — the editor loaded fine, but the image couldn't be loaded into the canvas.
* **`onError`** — the wrapper couldn't reach a working editor.

## Tools

The editor ships eight tools, rendered as a tab rail beside the canvas:

| Tool       | What it does                                                                   |
| ---------- | ------------------------------------------------------------------------------ |
| `crop`     | Crop with rotate (90° steps), flip, and a straighten slider.                   |
| `resize`   | Change the output dimensions.                                                  |
| `filter`   | One-tap presets plus adjustment sliders.                                       |
| `draw`     | Freehand brush with color, type, and size controls.                            |
| `text`     | Text layers with style presets, fonts, color/background/outline/shadow.        |
| `shapes`   | Filled/outline/gradient shape palettes with drag, resize, rotate, and styling. |
| `stickers` | A bundled sticker library grouped by category.                                 |
| `frame`    | Frame presets with a size slider and color picker.                             |

All tools are enabled by default. Configure them through `options.features.imageEditor.tools`.

## AI Assistant

The editor includes an optional AI Assistant for chat-based edits.

## Localization

Set `options.locale` (bundled: `en`, `es`, `fr`, `de`, `it`, `pt`, `nl`, `ja`, `ko`, `zh`) and optionally override strings with `options.translations`.

## Demo

Try the live demo at [editraa.netlify.app](https://editraa.netlify.app/), or run it locally — a Vite-based demo lives in `demo/`:

```sh
cd demo
npm install
npm run dev
```

## License

MIT Licensed.
