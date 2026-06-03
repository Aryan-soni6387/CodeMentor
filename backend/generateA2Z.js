const fs = require("fs");
const path = require("path");


const repoPath =
  "C:/Users/aryn0/Downloads/Strivers-A2Z-DSA-Sheet-main";

const problems = [];

const topicFolders = fs.readdirSync(repoPath);

topicFolders.forEach((topicFolder) => {

  const topicPath = path.join(
    repoPath,
    topicFolder
  );

  if (!fs.statSync(topicPath).isDirectory())
    return;

  const topicName = topicFolder
    .replace(/^\d+\./, "")
    .trim();

  const difficultyFolders =
    fs.readdirSync(topicPath);

  difficultyFolders.forEach(
    (difficultyFolder) => {

      const difficultyPath =
        path.join(
          topicPath,
          difficultyFolder
        );

      if (
        !fs
          .statSync(difficultyPath)
          .isDirectory()
      )
        return;

      let difficulty = "Medium";

      if (
        difficultyFolder.includes("Easy")
      )
        difficulty = "Easy";

      if (
        difficultyFolder.includes(
          "Medium"
        )
      )
        difficulty = "Medium";

      if (
        difficultyFolder.includes("Hard")
      )
        difficulty = "Hard";

      const files =
        fs.readdirSync(
          difficultyPath
        );

      files.forEach((file) => {

        if (!file.endsWith(".cpp"))
          return;

        const name = file
          .replace(".cpp", "")
          .replace(/^\d+\./, "")
          .replace(/_/g, " ")
          .trim();

        problems.push({
          name,
          topic: topicName,
          difficulty,
          link: "",
        });
      });
    }
  );
});

fs.writeFileSync(
  "a2z.json",
  JSON.stringify(
    problems,
    null,
    2
  )
);

console.log(
  `Generated ${problems.length} problems`
);