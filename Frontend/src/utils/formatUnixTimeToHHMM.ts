
export default function formatUnixTimeToHHMM(UNIX_timestamp: string) {
  return new Date(UNIX_timestamp).toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
