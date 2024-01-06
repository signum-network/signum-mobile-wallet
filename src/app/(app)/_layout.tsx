import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (true) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/welcome" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack />;
}
