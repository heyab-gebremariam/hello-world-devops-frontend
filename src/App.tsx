import { useEffect, useState } from 'react';
import './App.css';
interface Task {
  ID: number;
  Title: string;
  Description: string;
  Completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(import.meta.env)

  // Read environment variables
  const APP_ENV = import.meta.env.VITE_APP_ENV;
  const DEV_URL = import.meta.env.VITE_BACKEND_DEV_URL;
  const TEST_URL = import.meta.env.VITE_BACKEND_TEST_URL;
  const PRODUCTION_URL = import.meta.env.VITE_BACKEND_PRODUCTION_URL;

  // Determine the API base URL based on the environment variable
  let API_BASE_URL = '';
  switch (APP_ENV) {
    case 'development':
      API_BASE_URL = DEV_URL;
      break;
    case 'test':
      API_BASE_URL = TEST_URL;
      break;
    case 'production':
      API_BASE_URL = PRODUCTION_URL;
      break;
    default:
      // Fallback or error handling if VITE_APP_ENV is not set or invalid
      console.error(`Unknown environment: ${APP_ENV}. Using development URL as fallback.`);
      API_BASE_URL = DEV_URL; // Default to dev URL
      setError(`Configuration Error: Unknown environment '${APP_ENV}'. Using development URL.`);
  }

  // Construct the full API URL for tasks
  const TASKS_API_URL = `${API_BASE_URL}/api/v1/tasks`;

  useEffect(() => {
    // Only attempt to fetch if API_BASE_URL is determined
    if (!API_BASE_URL) {
        setLoading(false); // Stop loading if URL is not set
        return;
    }

    const fetchTasks = async () => {

      console.log(TASKS_API_URL);
      try {
        const response = await fetch(TASKS_API_URL);

        if (!response.ok) {
          // Throw an error if the HTTP status is not OK
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data: Task[] = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        if (error instanceof Error) {
             setError(`Failed to load tasks: ${error.message}`);
        } else {
             setError("Failed to load tasks due to an unknown error.");
        }

      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [TASKS_API_URL, API_BASE_URL]);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (tasks.length === 0) {
    return <div>No tasks found.</div>;
  }

  return (
    <div className="App">
      <h2>Task List</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.ID}>
            <strong>{task.Title}</strong> - {task.Description}
          </li>
        ))}
      </ul>
      <h3>App Environment: {APP_ENV}</h3>
    </div>
  );
}

export default App;
