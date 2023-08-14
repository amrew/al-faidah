export const processData = function (
  data: { toString: () => string },
  sendObj: (params: Record<string, any>) => void
) {
  const lines = data
    .toString()
    .split("\n")
    .filter((line: string) => line.trim() !== "");

  for (const line of lines) {
    const message = line.toString().replace(/^data: /, "");
    if (message === "[DONE]") {
      sendObj({
        text: "",
        finish: true,
      });
      return;
    }
    try {
      const parsed = JSON.parse(message);
      if (parsed.error) {
        sendObj({
          text: "",
          finishReason: parsed.error.message,
        });
      } else {
        const finishReason = parsed.choices[0].finish_reason;
        const delta = parsed.choices[0].delta?.content;
        if (delta) {
          sendObj({
            text: delta,
            finishReason,
          });
        }
      }
    } catch (error) {
      console.error("Could not JSON parse stream message", message, error);
    }
  }
};
