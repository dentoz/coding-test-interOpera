import { useReps } from "./reps.hooks";
import { RepsTable } from "../components/repsTable";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import styles from "../styles/reps.module.scss";
import chatStyle from "../styles/chat.module.scss";
import { useQuestion } from "./question.hooks";
import { isEmpty } from "lodash";

export default function Home({ reps }) {
  const { loading } = useReps();
  const { fieldValue, handleFieldChange, handleAskQuestion, chat } =
    useQuestion();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Next.js + FastAPI Sample</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Dummy Data</h2>
        <Container className={styles["reps-table-container"]}>
          <RepsTable loading={loading} reps={reps} />
        </Container>
      </section>

      <section>
        <h2>Ask a Question (AI Endpoint)</h2>
        <Container sx={{ backgroundColor: '#F9FBF9', padding: '0 !important' }}>
          {!isEmpty(chat) && (
            <Stack sx={{ padding: "1rem" }} spacing={2}>
              {chat.map((item, index) => (
                <div
                  key={index}
                  className={`${chatStyle["chat-item"]} ${
                    item.role == "user" ? "user" : "assistant"
                  }`}
                >
                  <Typography variant="body1">{item.content}</Typography>
                </div>
              ))}
            </Stack>
          )}
          <TextField
            variant="filled"
            fullWidth
            placeholder="Enter your question..."
            value={fieldValue}
            onChange={handleFieldChange}
            slotProps={{
              input: {
                endAdornment: (
                  <Button
                    variant="contained"
                    onClick={() => handleAskQuestion()}
                  >
                    Ask
                  </Button>
                ),
              },
            }}
          />
        </Container>
      </section>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch("http://localhost:8000/api/data", {
    cache: "force-cache",
    next: { revalidate: 60 },
  });

  if (res.status !== 200) {
    return {
      props: {
        reps: [],
      },
    };
  }
  const data = await res.json();

  return {
    props: {
      reps: data.data,
    },
  };
}
