import { useCallback, useState } from "react";
import { debounce } from "lodash";

export const useQuestion = () => {
  const [fieldValue, setFieldValue] = useState("");
  const [chat, setChat] = useState([]);
  const debouncedSave = useCallback(
    debounce((e) => {
      if (typeof onChange !== "undefined") {
        onChange(e);
      }
    }, 1000),
    []
  );

  const handleFieldChange = (e) => {
    const value = e.target.value;
    setFieldValue(value);
    debouncedSave(e);
  };


  const sendChat = async () => {
    const response = await fetch("http://localhost:8000/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: fieldValue }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const _chat = [...chat]
    _chat.push({ role: "assistant", content: data.data })
    setChat(_chat);
  }

  const handleAskQuestion = () => {
    const _chat = [...chat]
    _chat.push({ role: "user", content: fieldValue })
    sendChat()
    setChat(_chat)
  }

  return { fieldValue, handleFieldChange, handleAskQuestion, chat };
};
