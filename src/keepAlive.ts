import { CronJob } from "cron";
import https from "https";

export async function keepAlive(backendURL: string) {
  try {
    const job = new CronJob("*/1 * * * *", async () => {
      // Send a GET request to the server to keep it alive
      console.log("Sending keep-alive request...");
      https
        .get(backendURL, (res) => {
          if (res.statusCode === 200) {
            res.setEncoding("utf8");
            res.on("data", function (data) {
              console.log("Keep-alive response:", data);
            });
            console.log("Keep-alive request sent successfully.");
          } else {
            console.log(
              "Keep-alive request failed with status code:",
              res.statusCode
            );
          }
        })
        .on("error", (error) => {
          console.error("Error sending keep-alive request:", error);
        });
    });

    return job;
  } catch (error) {
    console.error("Error sending keep-alive request:", error);
    return null;
  }
}
