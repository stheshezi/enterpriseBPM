"use client";

import React, { KeyboardEvent } from "react";

export type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
};

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = tabs.slice(index + direction).find((tab) => !tab.disabled);
    if (next) onTabChange(next.id);
  }

  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="ui-tabs">
      <div className="ui-tabs__list" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            disabled={tab.disabled}
            aria-selected={tab.id === active.id}
            className={tab.id === active.id ? "is-active" : ""}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="ui-tabs__panel" role="tabpanel">{active?.content}</div>
    </div>
  );
}
