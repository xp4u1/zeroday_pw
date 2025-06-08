import { spawn } from "node:child_process";
import { KubeConfig } from "@kubernetes/client-node";

const kubeConfig = new KubeConfig();
kubeConfig.loadFromCluster();

const kubernetesNamespace = process.env.SANDBOX_NAMESPACE || "zeroday";

/**
 * Start a challenge sandbox and create a route using Traefik.
 *
 * The name must start with a letter and must only contain:
 * - Letters (a-z, A-Z)
 * - Numbers (0-9)
 * - Hyphens (-)
 *
 * @param sandboxName Name of the new sandbox. Will be a part of the subdomain.
 * @param helmValues Helm configuration for the Kubernetes deployment. Use `\n` for multiline configs.
 */
export const createSandbox = async (
  sandboxName: string,
  helmValues: string,
) => {
  if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(sandboxName))
    throw new Error(`Invalid sandbox name: ${sandboxName}`);

  await executeHelmCommand(
    [
      "install",
      sandboxName,
      "./kubernetes/helm/sandbox",
      `--namespace=${kubernetesNamespace}`,
      "-f",
      "-",
    ],
    helmValues,
  );
};

/**
 * Stop and remove a challenge sandbox from the cluster.
 * @param helmName Helm release name of the challenge sandbox
 */
export const stopSandbox = async (helmName: string) => {
  await executeHelmCommand([
    "uninstall",
    helmName,
    `--namespace=${kubernetesNamespace}`,
  ]);
};

/**
 * Execute a Helm command with optional stdin.
 * @param args Arguments to pass to the Helm CLI
 * @param stdin Optional input to write to Helm's stdin
 * @returns A promise that resolves when the command succeeds, or rejects on failure
 */
const executeHelmCommand = (args: string[], stdin?: string) => {
  return new Promise<void>((resolve, reject) => {
    const helm = spawn("helm", args);

    if (stdin) {
      helm.stdin.write(stdin);
      helm.stdin.end();
    }

    //helm.stdout.on("data", (data) => console.log(`[Helm] ${data}`));
    helm.stderr.on("data", (data) => console.error(`[Helm] ${data}`));

    helm.on("close", (code) => (code == 0 ? resolve() : reject(code)));
    helm.on("error", (error) => reject(error));
  });
};
