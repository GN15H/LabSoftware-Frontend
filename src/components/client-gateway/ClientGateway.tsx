export function fieldSx() {
  return {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f8f9fa",
      borderRadius: 2,
      "& fieldset": { borderColor: "#ecf0f1", borderWidth: 2 },
      "&:hover fieldset": { borderColor: "#bdc3c7" },
      "&.Mui-focused fieldset": { borderColor: "#3498db" },
    },
  } as const;
}

