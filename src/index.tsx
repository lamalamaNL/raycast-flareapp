import { ActionPanel, Detail, List, Action, getPreferenceValues } from "@raycast/api";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { FLAREAPP_API_URL } from './config'

type Project = {
    id: number;
    name: string;
    errors_last_30_days_count: number;
    errors_previous_30_days_count: number;
    api_key: string;
    api_public_key: string;
    last_error_received_at: string;
    spike_protection_active_until: string;
    stage: string;
};

export default function Command() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { API_TOKEN } = getPreferenceValues();

  useEffect(() => {
    fetch(`${FLAREAPP_API_URL}/projects?api_token=${API_TOKEN}`, {
      headers: { Accept: 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects((data as any).data);
      });
  }, []);

  return (
    <List>
      {projects && projects.map(project => { return (<List.Item
        key={project.id}
        title={project.name}
        actions={
            <ActionPanel title="Flare">
            <Action.OpenInBrowser url={`https://flareapp.io/projects/${project.id}`} />
          </ActionPanel>
        }
      />)})}
    </List>
  );
}
