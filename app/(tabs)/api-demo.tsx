import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, ButtonText } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  API_BASE_URL,
  useDelete,
  useGet,
  usePatch,
  usePost,
  usePut,
} from "@/lib/api";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

export default function ApiDemoScreen() {
  // Lazy GET example (won't auto-run until you press the button)
  const getPing = useGet<any, Error>(["ping"], "/ping", { enabled: false });

  // Mutation examples: update paths to real endpoints in your API
  const postDemo = usePost<any, { message: string }, Error>("/demo/post");
  const putDemo = usePut<any, { id: number; name: string }, Error>("/demo/put");
  const patchDemo = usePatch<any, { id: number; name?: string }, Error>(
    "/demo/patch"
  );

  // For DELETE, many APIs expect an ID in the path; adjust as needed
  const [deleteId] = useState<number>(1);
  const deletePath = `/demo/items/${deleteId}`; // change to your real resource path
  const deleteDemo = useDelete<any, void, Error>(deletePath);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type="h2_header">API Demo</ThemedText>
        <ThemedText>
          Base URL: <ThemedText type="default">{API_BASE_URL}</ThemedText>
        </ThemedText>

        {/* GET example */}
        <ThemedView style={styles.card}>
          <ThemedText type="h4_header">GET /ping</ThemedText>
          <Button
            className="bg-primary-500"
            onPress={() => getPing.refetch()}
            size="md"
            variant="solid"
            action="default"
            disabled={getPing.isFetching}
          >
            <ButtonText className="text-typography-white py-2">
              {getPing.isFetching ? "Fetching..." : "Fetch"}
            </ButtonText>
          </Button>
          {getPing.error && (
            <ThemedText>Error: {String(getPing.error)}</ThemedText>
          )}
          {getPing.data && (
            <ThemedText>
              Response:{" "}
              {typeof getPing.data === "string"
                ? getPing.data
                : JSON.stringify(getPing.data)}
            </ThemedText>
          )}
        </ThemedView>

        {/* POST example */}
        <ThemedView style={styles.card}>
          <ThemedText type="h4_header">POST /demo/post</ThemedText>
          <Button
            className="bg-primary-500"
            onPress={() => postDemo.mutate({ message: "Hello from POST" })}
            size="md"
            variant="solid"
            action="default"
            disabled={postDemo.isPending}
          >
            <ButtonText className="text-typography-white py-2">
              {postDemo.isPending ? "Posting..." : "Send POST"}
            </ButtonText>
          </Button>
          {postDemo.error && (
            <ThemedText>Error: {String(postDemo.error)}</ThemedText>
          )}
          {postDemo.data && (
            <ThemedText>Response: {JSON.stringify(postDemo.data)}</ThemedText>
          )}
        </ThemedView>

        {/* PUT example */}
        <ThemedView style={styles.card}>
          <ThemedText type="h4_header">PUT /demo/put</ThemedText>
          <Button
            className="bg-primary-500"
            onPress={() => putDemo.mutate({ id: 1, name: "Updated via PUT" })}
            size="md"
            variant="solid"
            action="default"
            disabled={putDemo.isPending}
          >
            <ButtonText className="text-typography-white py-2">
              {putDemo.isPending ? "Putting..." : "Send PUT"}
            </ButtonText>
          </Button>
          {putDemo.error && (
            <ThemedText>Error: {String(putDemo.error)}</ThemedText>
          )}
          {putDemo.data && (
            <ThemedText>Response: {JSON.stringify(putDemo.data)}</ThemedText>
          )}
        </ThemedView>

        {/* PATCH example */}
        <ThemedView style={styles.card}>
          <ThemedText type="h4_header">PATCH /demo/patch</ThemedText>
          <Button
            className="bg-primary-500"
            onPress={() => patchDemo.mutate({ id: 1, name: "Patched name" })}
            size="md"
            variant="solid"
            action="default"
            disabled={patchDemo.isPending}
          >
            <ButtonText className="text-typography-white py-2">
              {patchDemo.isPending ? "Patching..." : "Send PATCH"}
            </ButtonText>
          </Button>
          {patchDemo.error && (
            <ThemedText>Error: {String(patchDemo.error)}</ThemedText>
          )}
          {patchDemo.data && (
            <ThemedText>Response: {JSON.stringify(patchDemo.data)}</ThemedText>
          )}
        </ThemedView>

        {/* DELETE example */}
        <ThemedView style={styles.card}>
          <ThemedText type="h4_header">DELETE {deletePath}</ThemedText>
          <Button
            className="bg-primary-500"
            onPress={() => deleteDemo.mutate(undefined)}
            size="md"
            variant="solid"
            action="default"
            disabled={deleteDemo.isPending}
          >
            <ButtonText className="text-typography-white py-2">
              {deleteDemo.isPending ? "Deleting..." : "Send DELETE"}
            </ButtonText>
          </Button>
          {deleteDemo.error && (
            <ThemedText>Error: {String(deleteDemo.error)}</ThemedText>
          )}
          {deleteDemo.data && (
            <ThemedText>Response: {JSON.stringify(deleteDemo.data)}</ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  card: {
    gap: 8,
    marginBottom: 8,
  },
});
