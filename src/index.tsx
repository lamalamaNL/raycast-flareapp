import { ActionPanel, List, Action, getPreferenceValues } from "@raycast/api";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { FLAREAPP_API_URL } from "./config";

interface Project {
  id: number;
  name: string;
  errors_last_30_days_count: number;
  errors_previous_30_days_count: number;
  api_key: string;
  api_public_key: string;
  last_error_received_at: string;
  spike_protection_active_until: string;
  stage: string;
}

interface ProjectsResponse {
  data: Project[];
}

export default function Command() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { API_TOKEN } = getPreferenceValues();

  useEffect(() => {
    async function getProjects() {
      const response = await fetch(`${FLAREAPP_API_URL}/projects?api_token=${API_TOKEN}`, {
        headers: {
          Accept: "application/json",
        },
      });

      let data: { data: Project[] } = { data: [] };
      try {
        data = (await response.json()) as ProjectsResponse;
      } catch (e) {
        console.error(e);
      } finally {
        setProjects(data.data);
        setLoading(false);
      }
    }

    getProjects();
  }, []);

  return (
    <List isLoading={loading}>
      {projects &&
        projects.map((project) => {
          return (
            <List.Item
              key={project.id}
              title={project.name}
              actions={
                <ActionPanel title="Flare">
                  <Action.OpenInBrowser url={`https://flareapp.io/projects/${project.id}`} />
                </ActionPanel>
              }
            />
          );
        })}
    </List>
  );
}
