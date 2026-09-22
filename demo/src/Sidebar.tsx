import React, { useRef } from 'react';

import type { UnlayerLocale } from '@unlayer/types';

import type { FilterPreset } from './App';

export const TOOL_NAMES = [
  'crop',
  'resize',
  'filter',
  'draw',
  'text',
  'shapes',
  'stickers',
  'frame',
] as const;

export type ToolName = (typeof TOOL_NAMES)[number];

const FILTER_PRESETS: { value: FilterPreset; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'bright', label: 'Bright' },
  { value: 'warm', label: 'Warm' },
  { value: 'noir', label: 'Noir' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'dramatic', label: 'Dramatic' },
];

interface SidebarProps {
  theme: 'light' | 'dark';
  onThemeChange(theme: 'light' | 'dark'): void;
  locale: UnlayerLocale;
  onLocaleChange(locale: UnlayerLocale): void;
  filterPreset: FilterPreset;
  onFilterPresetChange(filterPreset: FilterPreset): void;
  dock: 'left' | 'right';
  onDockChange(dock: 'left' | 'right'): void;
  tools: Record<ToolName, boolean>;
  onToolToggle(tool: ToolName): void;
  onChangeImage(): void;
  onUploadImage(file: File): void;
  onCheckChanges(): void;
  onSnapshot(): void;
}

export default function Sidebar(props: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="sidebar">
      <section className="section">
        <h2 className="section-label">Actions</h2>
        <button onClick={props.onChangeImage}>Change image</button>
        <button onClick={() => fileInputRef.current?.click()}>
          Upload image…
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            // Clear before the callback so re-selecting the same file always
            // fires onChange, even if the handler throws.
            event.target.value = '';
            if (file) props.onUploadImage(file);
          }}
        />
        <button onClick={props.onCheckChanges}>Has changes?</button>
        <button onClick={props.onSnapshot}>Snapshot</button>
      </section>

      <section className="section">
        <h2 className="section-label">Options (live)</h2>

        <div className="segmented-group">
          <span className="segmented-label">Theme</span>
          <div className="segmented-control" role="tablist" aria-label="Theme">
            {(['light', 'dark'] as const).map((theme) => (
              <button
                key={theme}
                type="button"
                className={props.theme === theme ? 'is-active' : ''}
                onClick={() => props.onThemeChange(theme)}
              >
                {theme === 'light' ? 'Light' : 'Dark'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-label">Filter presets</h2>
        <div className="filter-grid">
          {FILTER_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={
                props.filterPreset === preset.value
                  ? 'filter-chip active'
                  : 'filter-chip'
              }
              onClick={() => props.onFilterPresetChange(preset.value)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-label">Dock (remounts editor)</h2>
        <div className="segmented-group">
          <span className="segmented-label">Toolbar position</span>
          <div
            className="segmented-control"
            role="tablist"
            aria-label="Toolbar position"
          >
            {(['left', 'right'] as const).map((dock) => (
              <button
                key={dock}
                type="button"
                className={props.dock === dock ? 'is-active' : ''}
                onClick={() => props.onDockChange(dock)}
              >
                {dock === 'left' ? 'Left' : 'Right'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-label">Tools (remounts editor)</h2>
        <div className="tool-grid">
          {TOOL_NAMES.map((tool) => (
            <label key={tool} className="tool-toggle">
              <input
                type="checkbox"
                checked={props.tools[tool]}
                onChange={() => props.onToolToggle(tool)}
              />
              {tool}
            </label>
          ))}
        </div>
      </section>
    </aside>
  );
}
