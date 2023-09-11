export function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        paddingBottom: 50,
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
