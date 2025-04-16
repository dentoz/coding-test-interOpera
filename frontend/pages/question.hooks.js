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
      setChat((prev) => {
        const _chat = [...prev]
        _chat.push({ role: "assistant", content: 'Network response was not ok' })
        return _chat
      });
    }
    const data = await response.json();
    setChat((prev) => {
      const _chat = [...prev]
      _chat.push({ role: "assistant", content: data.data })
      return _chat
    });
  }

  const handleAskQuestion = async () => {
    const _chat = [...chat]
    _chat.push({ role: "user", content: fieldValue })
    setChat(_chat)
    setFieldValue("");
    await sendChat()
  }

  return { fieldValue, handleFieldChange, handleAskQuestion, chat };
};
