import { ActionPanel, List, Action, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { FLAREAPP_API_URL } from "./config";

export default function Command() {
  const [error, setError] = useState<Error>();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { API_TOKEN } = getPreferenceValues();

  useEffect(() => {
    async function getProjects() {
      const response = await fetch(`${FLAREAPP_API_URL}/projects?api_token=${API_TOKEN}`, {
        headers: { Accept: "application/json" },
      });

      let data: { data: IProject[] } = { data: [] };
      try {
        data = (await response.json()) as ProjectsResponse;
      } catch (e) {
        setError(new Error("while fetching your projects"));
      } finally {
        setProjects(data.data);
        setLoading(false);
      }
    }

    getProjects();
  }, []);

  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Something went wrong",
        message: error.message,
      });
    }
  }, [error]);

  return (
    <List isLoading={loading}>
      {projects.map((project) => {
        const accessories: List.Item.Accessory[] = [
          {
            tag: `${project.errors_last_30_days_count} errors`,
            tooltip: "Last 30 days",
          },
        ];

        return (
          <List.Item
            key={project.id}
            title={project.name}
            subtitle={project.stage}
            accessories={accessories}
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

interface IProject {
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

type ProjectsResponse = {
  data: IProject[];
};
