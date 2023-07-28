import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import { store } from "./redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>

    </QueryClientProvider>
  </Provider>
);
