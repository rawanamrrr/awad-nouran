import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import path from "path";
import { handleRsvp } from "./server/rsvpHandler.js";

// Serves POST /api/rsvp (sends the RSVP email) while developing, so `npm run dev` is all you need.
const rsvpApi = (): Plugin => ({
  name: "rsvp-api",
  configureServer(server) {
    server.middlewares.use("/api/rsvp", (req, res) => {
      void handleRsvp(req, res);
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), rsvpApi()],
  publicDir: "./static",
  base: "./",
  server: {
    host: true, // listen on all network interfaces so phones on the same Wi-Fi can connect
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
