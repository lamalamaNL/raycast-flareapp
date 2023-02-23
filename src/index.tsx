import { ActionPanel, Detail, List, Action, getPreferenceValues } from "@raycast/api";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { FLAREAPP_API_URL } from './config'

export default function Command() {
  return (
    <List>
      <List.Item
        title="Greeting"
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown="# Hey! 👋" />} />
          </ActionPanel>
        }
      />
    </List>
  );
}
